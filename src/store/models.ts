// app state
export interface IApp {
    windowSize: {width: number, height: number}
    portrait: boolean
    theme?: string
    message?: {content: string, exposition?: string}
    commonChat: IMessage[]
    gameChat: IMessage[]
}

export interface IMessage {content: string, from: string, to: string, date: Date, emoji: number, }

// export interface IUserState extends IUser {
//     name: string | null
//     token: string | null
//     userId: string | null
//     rating: number
//     language: string
//     notifications: [{[key: string]: any}]
// }

// timer interfaces
export interface ITimer {
    min: string;
    sec: string;
}

export interface IClock {
    timeToGame: number
    adds?: number 
    timeToFirstMove?: number
}

export interface Timing {
    timeToGame: number,
    adds: number
}

export interface IError {
    message: string | null
}

// board to draw
export enum TowerType {
    m = 'man',
    k = 'king'
}

export enum PieceColor {
    b = 'black',
    w = 'white'
}

export enum BoardNotation {
    ch = 'chess',
    dr = 'draughts'
}
export interface IPositionsTree {[key: string]: IBoardToGame}
export interface PositionsTree {[key: string]: TowersMap}

export interface CellsMap {[key: string]: ITowerPosition}

export interface IBoardProps {boardOptions: IBoardOptions, possibleMoves?: CellsMap, lastMove: string[]}

export interface IBoardBase {
    cellsMap: CellsMap
    cellSize: number
    towers: TowersMap
}

export interface IBoardToDraw extends IBoardBase {
    mouseDown: boolean
    lastMoveSquares?: string[]
    towerView: string,
    towerTouched?: TowerTouched
}

export interface IGameBoard extends IBoardToDraw {
    mandatoryMoves?: IMMRResult[]
    freeMoves?: IMMRResult
    positionsTree?: IPositionsTree
    currentPosition: IBoardToGame
    mandatoryMoveStep: number
    animationStarted: boolean;
    moveDone: boolean;
}

export interface IBoard  extends IBoardToDraw {
    mouseDown: boolean
    mandatoryMoves?: MMRResult[]
    freeMoves?: MMRResult[]
    positionsTree: PositionsTree
    mandatoryMoveStep: number
    animationStarted: boolean
    moveDone: boolean
}

export interface IAnalysisBoard extends IBoardToDraw{
    mandatoryMoves?: IMMRResult[]
    freeMoves?: IMMRResult
    positionsTree?: IPositionsTree
    currentPosition: IBoardToGame
    mandatoryMoveStep?: number;
    moveDone?: boolean    
}

export interface ICell {
    type?: 'light' | 'dark';
    indexes?: string;
    [propName: string]: any;  
}

// towers
export interface ITowerPosition {
    x: number;
    y: number;
}

export interface TowersMap {[key: string]: TowerConstructor}

export interface IRef<T> {
    readonly current: T | null
}

export enum Directions {
   lu = 'leftUp',
   ld = 'leftDown',
   ru = 'rightUp',
   rd = 'rightDown'
}

export interface IAnalysisState {
    gameResult: IGameResult
    settingPosition: boolean
    pieceOrder: PieceColor
    movesMainLine?: string[]
    analyzeLastGame: boolean
    movesCurrentLine: string[]
    lastMove: {index: number, move: string}
    depth: number
    evaluate: boolean
    removePiece: boolean
    startPosition: boolean,
    bestMoveLine: { move: string, value: number }[]
}

export interface ICheckerTower  {
    currentType?: TowerType;
    currentColor: PieceColor;
    wPiecesQuantity?: number;
    bPiecesQuantity?: number;
    positionInDOM?: ITowerPosition;
    onBoardPosition: string;
    [key: string]: any;
}

export interface INewGameProps {
    gameKey: string
    white: IPlayer,
    black: IPlayer,
    whiteClock: IClock,
    blackClock: IClock,
    moveOrder: IMoveOrder
}

export class TowerConstructor implements ICheckerTower {
    onBoardPosition: string;
    currentColor: PieceColor;
    wPiecesQuantity: number;
    bPiecesQuantity: number;
    positionInDOM?: ITowerPosition;
    currentType: TowerType;
    view?: string;
    mandatoryMove?: boolean;
    constructor(props: ICheckerTower ) {
        this.currentType = props.currentType || TowerType.m;
        this.currentColor = props.currentColor;
        this.wPiecesQuantity = props.wPiecesQuantity || (props.currentColor === PieceColor.w ? 1 : 0);
        this.bPiecesQuantity = props.bPiecesQuantity || (props.currentColor === PieceColor.b ? 1 : 0);
        this.positionInDOM = props.positionInDOM || {x: 0, y: 0};
        this.onBoardPosition = props.onBoardPosition
        this.view = props.view || 'face'
        this.mandatoryMove = props.mandatoryMove || false
    }
}

export type PartialTower = Partial<TowerConstructor>

// game
export interface IMoveOrder {
    pieceOrder: PieceColor
    playerTurn: string
}

export interface ITotalMoves {mandatory?: FullMRResult[], free?: FreeMRResult[]}

export interface IMoveToMake {
    gameKey?: string,
    moveToMake: MMRResult,
    moveOrder: IMoveOrder,
    receivedAt?: Date,
    whiteClock?: IClock,
    blackClock?: IClock
}

export interface IMoveProps {
    gameKey?: string,
    moveToSave: IMMRResult,
    moveOrder: IMoveOrder,
    receivedAt?: Date,
    whiteClock?: IClock,
    blackClock?: IClock
}

export type IGameMode = 'isPlaying' | 'isOver' | 'isAnalyzing' | 'isPreparing'

export interface IGameState {
    gameKey?: string
    moveOrder: IMoveOrder
    gameStarted: boolean
    gameConfirmed: boolean
    history: string[]
    playerColor: PieceColor
    white: IPlayer
    black: IPlayer
    lastGameResult?: IGameResult | null
    ineffectiveMoves?: number
    portrait?: boolean
    gameMode: IGameMode
    rivalOfferedDraw: boolean,
}

export type GameType = 'ranked' | 'casual' | 'tournament'

export interface IGameOptionState {
    timing: Timing
    gameType: GameType
    playerColor: PieceColor | 'random'
    rivalType: RivalType
    rivalLevel: number
    gameVariant: GameVariants
    gameSetupFinished: boolean
    waitingRival: boolean
}

export interface TowerTouched {
    key: string
    possibleMoves: CellsMap
    startCursorPosition: ITowerPosition
    startTowerPosition: ITowerPosition
    towerColor: PieceColor
    towerType: TowerType
}

export type GameVariants = 'towers' | 'russian' | 'international'

export interface IBoardToGame {
    [key: string]: IBoardCell
}

export interface Board {
    [key: string]: BoardCell
}

export interface IBoardOptions {
    boardSize: number,
    boardTheme?: string,
    topLegend?: string[],
    sideLegend?: number[],
    withOutLegend?: boolean,
    legendsInside?: boolean,
    boardNotation: BoardNotation,
    reversedBoard: boolean
}

export enum Online {
    online,
    offline,
    reconnecting
}

export interface IPlayer {
    name: string
    onlineStatus?: Online
    userId?: string
    rating?: number
}

export type EndGameConditions = 'surrender' 
    | 'outOfTime'
    | 'noMoves'
    | 'drawByAgreement' 
    | 'drawByRules'
    | 'abandonedByWhite'
    | 'abandonedByBlack'

export interface IGameResult {
    gameKey?: string,
    winner: PieceColor | 'draw'
    reason: EndGameConditions
    white: IPlayer
    black: IPlayer
    playerColor?: PieceColor
    movesHistory: string[]
    gameVariant: GameVariants
    timing: string
    boardSize?: number
    date: Date
}

export interface BoardCell {
    pos?: ITowerPosition;
    neighbors: INeighborCells;
    boardKey: string
}

export interface IBoardCell {
    pos?: ITowerPosition;
    tower: PartialTower | null
    neighbors: INeighborCells;
    boardKey: string
}

export interface INeighborCells {
    [key: string]: string
}

export interface IDiagonals {[key: string]: IBoardCell[]}
export interface Diagonals {[key: string]: BoardCell[]}


export interface IMMRResult {
    move: string
    position: IBoardToGame
    takenPieces?: string[]
}

export interface MMRResult {
    move: string
    position: TowersMap
    takenPieces?: string[]
}

export interface ISortedMoves {maxLength?: number, maxLengthMoves: FullMRResult[], restMoves: FullMRResult[]}

export interface MResult {
    move: string[]
    startPosition: TowersMap
}

export interface FreeMRResult extends MResult {
    endPosition?: TowersMap
}

export interface FullMRResult extends MResult {
    endPosition: TowersMap
    takenPieces: string[]
    lastStepDirection: string
    minLength: number
    completed?: boolean
}

export interface StepMProps extends MResult {
    takenPieces: string[]
}

export type RivalType = 'player' | 'PC' 

// user
export interface IUser {
    token: string | null,
    userId: string | null,
    name: string | null,
    rating: number | null
    language: string
}
