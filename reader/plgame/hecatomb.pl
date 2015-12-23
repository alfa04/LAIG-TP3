



/* -*- Mode:Prolog; coding:iso-8859-1; -*- */
:-use_module(library(random)). /*used to randomize which player starts*/
:-use_module(library(lists)).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                  %
% Hecatomb                         %
%                                  %
%                                  %
%                                  %
% Author : Francisco Couto         %
%          Joel Dinis              %
%                                  %
% ?- menu.                         %
% to start the game                %
%                                  %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



/*Initializes Board (8x8) $-> green soldier, v->void, &-> blue soldier, +->green king, *->blue king*/
board(B):-
    B=[
        [' $ ',' $ ',' $ ',' $ ',' + ',' $ ',' $ ',' $ '],
        [' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ '],
        [' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ '],
        [' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ ',' $ '],
        [' & ',' & ',' & ',' & ',' & ',' & ',' & ',' & '],
        [' & ',' & ',' & ',' & ',' & ',' & ',' & ',' & '],
        [' & ',' & ',' & ',' & ',' & ',' & ',' & ',' & '],
        [' & ',' & ',' & ',' & ',' * ',' & ',' & ',' & ']
        ].
heca:-board(B),nl, printB(B).

printB(H):- 
        write('   0   1   2   3   4   5   6   7'), nl,
        printB(H, 0).
    
printB([], _).

printB([H|T], Line):-
        write(Line), write(' '), printL(H), nl,
        NLine is Line+1, 
        printB(T, NLine). 
        
printL([]).

printL([H|T]):-
        write(H),write('|'), printL(T).
        
menu:-
write('*------------------*'),nl,
write('HELCOME TO HECATOMB!'),nl,
write('*------------------*'),nl,
write('Escolha um modo de jogo: pvp/pvb/bvb'),nl,nl,
read(Choice),gameMode(Choice),nl.

gameMode(pvp):-write('Prepare to face another player!'),nl,nl, play(pvp).

gameMode(pvb):-write('Prepare to face the computer!'),nl,nl, 
        menuDificuldade(D),
        (D == 'f' ->play('hbf'); 
        play('hbd')).

gameMode(bvb):-write('Computer against itself!'),nl,nl, play(bvb).

gameMode(_):-write('Wrong option, choose a new one!'), nl, read(Choice), gameMode(Choice),nl.

play(pvp):-
    random(1,3, Player), write('Player number '), 
    write(Player), write(' will start the game!'),nl,
    board(B),printB(B),pvpgame(Player, B, 10).

play(hbf):-random(1,3, Player), 
    ((Player == 1)->write('Human starts playing!'); 
    write('Bot starts playing!')),
    nl,board(B),printB(B), 
    pvbgame(Player, B, 10, hbf).

play(hbd):-random(1,3, Player), 
    ((Player == 1)->write('Human starts playing!'); 
    write('Bot starts playing!')),
    nl,board(B),printB(B),
    pvbgame(Player, B, 10, hbd).

play(bvb):-random(1,3, Player),write('Player number '), 
    write(Player), write(' will start the game!'),nl,
    board(B),printB(B),bvbgame(Player, B, 10).

%Checks if the game is over
pvpgame(_,Board,_):-            
        game_over(Board).

pvpgame(_,Board,0):-gameDraw(Board).

pvpgame(P,Board,Turns):-
    Turns > 0, 
    Turns2 is Turns-1,
    printPlayer(P,h), 
    movement(Xi,Yi,Xf,Yf,P,Board),
    getPiece(Xi,Yi,Board, Element),
    replace(Board, Xf, Yf, Element, B2), 
    replace(B2, Xi, Yi, '   ', B3), printB(B3),changePlayer(P,Novo),pvpgame(Novo,B3,Turns2).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
pvbgame(_,Board,_,_):-            
        game_over(Board).

pvbgame(_,Board,0,_):-gameDraw(Board).
    
pvbgame(P,Board,Turns,Dif):-
    Turns > 0,
    Turns2 is Turns-1,
    printPlayer(P,h),
    ((P == 1)->movement(Xi,Yi,Xf,Yf,P,Board);
    ((Dif == hbf)->getRandomMove(Board,2,_,Xi,Yi,Xf,Yf);
    getBestMove(Board,2,_,Xi,Yi,Xf,Yf))),
    write(Xi-Yi-Xf-Yf),
    getPiece(Xi,Yi,Board,Element),
    replace(Board, Xf, Yf, Element, B2), 
    replace(B2, Xi, Yi, '   ', B3), printB(B3),changePlayer(P,Novo), pvbgame(Novo,B3,Turns2,Dif).

bvbgame(_,Board,_):-            
        game_over(Board).

bvbgame(_,Board,0):-gameDraw(Board).
    
bvbgame(P,Board,Turns):-
    Turns > 0,
    Turns2 is Turns-1,
    printPlayer(P,h),
    getRandomMove(Board,P,_,Xi,Yi,Xf,Yf),
    write(Xi-Yi-Xf-Yf),
    getPiece(Xi,Yi,Board,Element),
    replace(Board, Xf, Yf, Element, B2), 
    replace(B2, Xi, Yi, '   ', B3), printB(B3),changePlayer(P,Novo), bvbgame(Novo,B3,Turns2).
     
replace( L , Y , X , Z , R ) :-
  append(RowPfx,[Row|RowSfx],L),     % decompose the list-of-lists into a prefix, a list and a suffix
  length(RowPfx,X) ,                 % check the prefix length: do we have the desired list?
  append(ColPfx,[_|ColSfx],Row) ,    % decompose that row into a prefix, a column and a suffix
  length(ColPfx,Y) ,                 % check the prefix length: do we have the desired column?
  append(ColPfx,[Z|ColSfx],RowNew) , % if so, replace the column with its new value
  append(RowPfx,[RowNew|RowSfx],R).   % and assemble the transformed list-of-lists
  
% Get Piece From [X,Y] of matrix
getPiece(X,Y,Board,Element):-
       nth0(Y,Board,Elem),nth0(X,Elem,Element).       
       
getPlayerMovement(Xi,Yi,Xf,Yf) :-           
        print('Coordenada X da peça a mover : '), read(Xi),
        print('Coordenada Y da peça a mover : '), read(Yi),
        print('Coordenada X da casa destino : '), read(Xf),
        print('Coordenada Y da casa destino : '), read(Yf).
        
checkOutOfBounds(Xi,Yi,Xf,Yf) :- 
    (Xf > -1, Xi > -1, 
    Xf < 8, Xi < 8,
    Yf > -1, Yi > -1,
    Yf < 8, Yi < 8).

% Checks if the coordinates are different              
positionsDifferent(Xi,Yi,Xf,Yf) :-
        (Xi \= Xf; Yi \= Yf).

checkCorrectPiece(1,Board,Xi,Yi,Xf,Yf):-getPiece(Xi,Yi,Board,InP), getPiece(Xf,Yf,Board,FnP),
    ((InP == ' $ '; InP == ' + '),(FnP == ' & '; FnP == ' * '; FnP == '   '));
    (write('You can only play YOUR pieces and eat your oponent´s!'),nl,fail).
    
checkCorrectPiece(2,Board,Xi,Yi,Xf,Yf):-getPiece(Xi,Yi,Board,InP), getPiece(Xf,Yf,Board,FnP),
    ((InP == ' & '; InP == ' * '),(FnP == ' $ '; FnP == ' + '; FnP == '   '));
    (write('You can only play YOUR pieces and eat your oponent´s!'),nl,fail).
    
checkMovement(Xi,Yi,Xf,Yf,Board):-
    getPiece(Xi,Yi,Board,P), checkPlay(Xi,Yi,Xf,Yf,P,D), checkPath(Xi,Yi,Xf,Yf,P,D,Board,0).
    
checkPlay(Xi,Yi,Xf,Yf,' $ ',D):-
    (Xi == Xf, Yi \= Yf)->(D = 'V');
    (Xi \= Xf, Yi == Yf)->(D = 'H');
    (abs(Xi - Xf) =:= abs(Yi - Yf))->(D = 'D');
    (write('Soldiers can only move orthogonaly or diagonaly!'),nl,fail).
    
checkPlay(Xi,Yi,Xf,Yf,' & ',D):-
    (Xi == Xf, Yi \= Yf)->(D = 'V');
    (Xi \= Xf, Yi == Yf)->(D = 'H');
    (abs(Xi - Xf) =:= abs(Yi - Yf))->(D = 'D');
    (write('Soldiers can only move orthogonaly or diagonaly!'),nl,fail).
    
checkPlay(Xi,Yi,Xf,Yf,' + ',_):-
    ((Xi == Xf, (Yi == (Yf-1); Yi == (Yf+1)));
    (((Xi == (Xf-1); Xi == Xf+1)), Yi == Yf);
    ((abs(Xi - Xf) =:= abs(Yi - Yf)),abs(Xi - Xf) =:= 1));
    (write('Kings can only move orthogonaly or diagonaly to and adjacent cell!'),nl,fail).
    
checkPlay(Xi,Yi,Xf,Yf,' * ',_):-
    ((Xi == Xf, (Yi == (Yf-1); Yi == (Yf+1)));
    (((Xi == (Xf-1); Xi == Xf+1)), Yi == Yf);
    ((abs(Xi - Xf) =:= abs(Yi - Yf)),abs(Xi - Xf) =:= 1));
    (write('Kings can only move orthogonaly or diagonaly to and adjacent cell!'),nl,fail).

checkPath(Xi,Yi,Xf,Yf,P,'V',Board,N):-
    (N > 1)->fail;
    Yi \= Yf,
    (Yi < Yf)->( 
    Y2 is Yi + 1,
    getPiece(Xi,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(Xi,Y2,Xf,Yf,P,'V',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(Xi,Y2,Xf,Yf,P,'V',Board,N2));
    fail)
    );
    (Yi > Yf)->( 
    Y2 is Yi - 1,
    getPiece(Xi,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(Xi,Y2,Xf,Yf,P,'V',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(Xi,Y2,Xf,Yf,P,'V',Board,N2));
    fail)
    );
    write('Clear Path').

checkPath(Xi,Yi,Xf,Yf,P,'H',Board,N):-
    (N > 1)->fail;
    Xi \= Xf,
    (Xi < Xf)->( 
    X2 is Xi + 1,
    getPiece(X2,Yi,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Yi,Xf,Yf,P,'H',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Yi,Xf,Yf,P,'H',Board,N2));
    fail)
    );
    (Xi > Xf)->( 
    X2 is Xi - 1,
    getPiece(X2,Yi,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Yi,Xf,Yf,P,'H',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Yi,Xf,Yf,P,'H',Board,N2));
    fail)
    );
    write('Clear Path').

checkPath(Xi,Yi,Xf,Yf,P,'D',Board,N):-
    (N > 1)->fail;
    Yi \= Yf,
    Xi \= Xf,
    (Yi < Yf,Xi < Xf)->(
    Y2 is Yi + 1,
    X2 is Xi + 1,
    getPiece(X2,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N2));
    fail)
    );
    (Yi > Yf, Xi > Xf)->(
    Y2 is Yi - 1,
    X2 is Xi - 1,
    getPiece(X2,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N2));
    fail)
    );
    (Yi > Yf, Xi < Xf)->(
    Y2 is Yi - 1,
    X2 is Xi + 1,
    getPiece(X2,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N2));
    fail)
    );
    (Yi < Yf, Xi > Xf)->(
    Y2 is Yi + 1,
    X2 is Xi - 1,
    getPiece(X2,Y2,Board,Piece),
    ((Piece == '   ')->(N2 is N, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N));
    (Piece \= P)->(N2 is N + 1, checkPath(X2,Y2,Xf,Yf,P,'D',Board,N2));
    fail)
    );
    write('Clear Path').    

movePiece(Xi,Yi,Xf,Yf,Player,Board):- 
         repeat,
         getPlayerMovement(Xi,Yi,Xf,Yf),
         positionsDifferent(Xi,Yi,Xf,Yf),
         checkOutOfBounds(Xi,Yi,Xf,Yf),
         checkCorrectPiece(Player,Board,Xi,Yi,Xf,Yf),
         checkMovement(Xi,Yi,Xf,Yf,Board).

movement(Xi,Yi,Xf,Yf,Player,Board):-movePiece(Xi,Yi,Xf,Yf,Player,Board),!.

listAllPossibleMoves(Board,Player,Value,List):-
    findall(X-Y-XF-YF-Value,
    allPossibleMoves(Board,Player,Value,X,Y,XF,YF),List).

%testMoves(Board,Player,Value,XIndex,YIndex,XFIndex,YFIndex). Tests if the Move can be done

testMoves(Board,Player,Value,XIndex,YIndex,XFIndex,YFIndex):-
    checkMovement(XIndex,YIndex,XFIndex,YFIndex,Board),
    checkValue(Board,Player,XIndex,YIndex,Value).                                                         

%allPossibleMoves(Board,Player,Value,X,Y,XF,YF). Generate and Test random movements                                                                          
                                                                                
allPossibleMoves(Board,Player,Value,X,Y,XF,YF):- 
    ((Player == 1),
    (getPiece(XIndex,YIndex,Board,' & '); getPiece(XIndex,YIndex,Board,' * ')),
    (getPiece(XFIndex,YFIndex,Board,' $ ');getPiece(XIndex,YIndex,Board,' + ')));
    ((Player == 2),
    (getPiece(XIndex,YIndex,Board,' $ '); getPiece(XIndex,YIndex,Board,' + ')),
    (getPiece(XFIndex,YFIndex,Board,' & ');getPiece(XIndex,YIndex,Board,' * '))),
    testMoves(Board,Player,Value,XIndex,YIndex,XFIndex,YFIndex),
    X is XIndex,Y is YIndex, XF is XFIndex, YF is YFIndex.

%getRandomMove(Board,Player,Value,X,Y,XF,YF).

getRandomMove(Board,Player,Value,X,Y,XF,YF):-
    listAllPossibleMoves(Board,Player,Value,List),
    random_member(X-Y-XF-YF-Value,List).

getBestMove(Board,Player,Value,X,Y,XF,YF):-
    listAllPossibleMoves(Board,Player,Value,List),
    chooseBestMove(List,X-Y-XF-YF-Value).

 chooseBestMove([PH|PT], BestMove):-
        maxList(PT, PH, BestMove).

maxList([], Max, Max).
maxList([Xi-Yi-Xf-Yf-V|T], CXi-CYi-CXf-CYf-Cv, Max) :- 
        ( V > Cv -> maxList(T, Xi-Yi-Xf-Yf-V, Max)
        ; maxList(T, CXi-CYi-CXf-CYf-Cv, Max) ).

checkValue(Board,Player,Xi,Yi,V):-
    (Player == 1 )->getPiece(Xr,Yr,Board,' * ');
    getPiece(Xr,Yr,Board,' + '),
    Xv is abs(Xr - Xi),
    Yv is abs(Yr - Yi),
    V is Xv + Yv.

% Changes the player
changePlayer(1,Novo):-
        Novo is 2.
changePlayer(2,Novo):-
        Novo is 1.
                                                              
    
% Writes whose turn it is to play
printPlayer(1,h):- write('Player 1 turn: '), nl.
printPlayer(2,h):- write('Player 2 turn: '), nl.

% Auxiliar menu to allow human to choose bot difficulty
menuDificuldade(Dificuldade):-
         print('Dificuldade do Jogo'), nl,
         print('Fácil (f)'), nl,
         print('Dificil (d)'), nl,
         read(Dificuldade).  

% Function to stop the game once we reach the 10th turn        
gameDraw(Board):-printB(Board), write('The Game ended in a draw (reached 10 turns), this is the final board!').

%Checks if player 1 has won
game_over(Board):-          
        \+ (getPiece(_,_,Board,' + ')),
        write('Game has ended! Player 2 wins!'), nl.

%Checks if player 2 has won        
game_over(Board):-           
        \+ (getPiece(_,_,Board,' * ')),
        write('Game has ended! Player 1 wins!'), nl.

%%%%%%%%%%FUNCAO DE TESTE PARA SERVIDOR, test(C,N)
%% C LISTA
%% N NUMERO DE LISTAS PARA RETORNAR IGUAIS
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

