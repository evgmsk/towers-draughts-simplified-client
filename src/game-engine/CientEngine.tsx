import React from 'react'

import {connect, ConnectedProps} from 'react-redux'
import {endGame, surrender} from '../store/game/actions'
import {
    SeekerProps,
    MoveWithRivalMoves
} from "../store/models";
import {oppositeColor} from './gameplay-helper-functions';
import {IRootState} from '../store/rootState&Reducer';
import mmr from './moves-resolver';
import bms from './best-move-seeker-towers';
import {turn} from '../store/board-towers/actions';
import {AnimationDuration} from '../constants/gameConstants';

interface IBestMove {move: string, deep: number}


const mapState = (state: IRootState) => ({
    towers: state.boardAndTowers.towers,
    engineColor: oppositeColor(state.game.playerColor),
    white: state.game.white,
    black: state.game.black,
    rivalLevel: state.gameOptions.rivalLevel,
    gameVariant: state.gameOptions.gameVariant,
    moveOrder: state.game.moveOrder,
    movesHistory: state.game.history,
    gameMode: state.game.gameMode,
})

const mapDispatch = {
    turn, endGame, surrender
}

const botConnector = connect(mapState, mapDispatch)

type BotProps = ConnectedProps<typeof botConnector>

class ClientEngine extends React.Component<BotProps, IBestMove> {
    componentDidMount() {
        console.log('created', this.props)
    }

    componentDidUpdate(prev: BotProps, prevState: IBestMove) {
        const {moveOrder, movesHistory, towers, gameMode, engineColor} = this.props
        const engineMove = moveOrder.pieceOrder === engineColor
        const props = {history: movesHistory, cP: towers, pieceOrder: moveOrder.pieceOrder}
        if (gameMode === 'isPlaying' && prev.gameMode !== 'isPlaying') {
            // console.log('new game', this.props)
            bms.setState(this.getSeekerProps())
            bms.setBestMoveCB(this.moveCB)
            if (engineMove) {
                setTimeout(bms.updateAfterRivalMove, AnimationDuration, props)
            }
        }
        if (prev.movesHistory.length !== movesHistory.length) {
            if (this.props.gameMode === 'isPlaying' && engineMove) {
                // console.log('start engine', this.props)
                bms.updateAfterRivalMove(props)
            } else {
                // console.log('stop engine', this.props)
            }
        }
    }

    getSeekerProps = (): SeekerProps => {
        const maxDepth = Math.min(5, this.props.rivalLevel + 2)
        return {
            maxDepth: maxDepth,
            startDepth: maxDepth,
            pieceOrder: this.props.moveOrder.pieceOrder,
            game: true,
        }
    }

    moveCB = (move: MoveWithRivalMoves) => {
        const {surrender, endGame, engineColor, gameMode} = this.props
        if (move.move === 'surrender') {
            surrender(engineColor)
        } else if (!move.move) {
            endGame('noMoves')
        } else if (!!move.move && gameMode === 'isPlaying') {
            this.completeMove(move)
        }
    }

    completeMove(move: MoveWithRivalMoves) {
        const {moveOrder: oldOrder, turn, white, black} = this.props
        const moveOrder = mmr.getNewOrder({moveOrder: oldOrder, white, black})
        turn({moveToSave: move, moveOrder: moveOrder})
    }

    render() {
        return null
    }
}

export const ClientBotEngine = botConnector(ClientEngine)
