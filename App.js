import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Pressable, Dimensions, PixelRatio, Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [rulesVisible, setRulesVisible] = useState(false);
  const [player1, setPlayer1] = useState('Player 1');
  const [player2, setPlayer2] = useState('Player 2');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [tile, setTile] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [moveHistory, setMoveHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [moveNumber, setMoveNumber] = useState(0);
  const [p1win, setP1Win] = useState(0);
  const [p2win, setP2Win] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0));


  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (winner) {
      scaleAnim.setValue(0);
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,   
          friction: 1,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,      
          friction: 1,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [winner]);
  

  const handleEdit = (player) => setEditingPlayer(player);
  const handleNameChange = (text, player) => {
    if (player === 'player1') setPlayer1(text);
    else setPlayer2(text);
  };
  const handleBlur = () => setEditingPlayer(null);

  const fillValue = (index) => {
    if (tile[index] !== "") {
      alert("That spot is already filled!");
      return;
    }

    const updatedTiles = [...tile];
    updatedTiles[index] = currentPlayer;
    const updatedHistory = [...moveHistory, index];

    if (updatedHistory.length > 6) {
      const toRemove = updatedHistory.shift();
      updatedTiles[toRemove] = "";
    }

    setTile(updatedTiles);
    setMoveHistory(updatedHistory);
    setMoveNumber(moveNumber + 1);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of winningConditions) {
      if (tile[a] && tile[a] === tile[b] && tile[a] === tile[c]) {
        const winnerName = tile[a] === 'X' ? player1 : player2;
        setTimeout(() => {
          setWinner(winnerName);
          winnerName === player1 ? setP1Win(p1win + 1) : setP2Win(p2win + 1);
        }, 100);
        break;
      }
    }
  }, [tile]);

  const resetGame = () => {
    setTile(Array(9).fill(""));
    setMoveHistory([]);
    setCurrentPlayer('X');
    setWinner(null);
    setMoveNumber(0);
    setEditingPlayer(null);
  };

  const resetScore = () => {
    setP1Win(0);
    setP2Win(0);
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>Tic Tac Toe 2</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Rules Modal */}
      <Modal visible={rulesVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Rules</Text>
            <Text style={styles.modalText}>
              🎮 Tic Tac Toe 2{'\n\n'}
              1. {player1} → 'X' | {player2} → 'O' {'\n'}
              2. Goal: Get 3 marks in a row. {'\n'}
              3. Tap an empty tile to place your mark. {'\n'}
              4. Only latest 6 moves are visible. {'\n'}
              5. Older moves are blurred and removed. {'\n'}
              6. Winning shows the player name & score updates. {'\n'}
              7. "Restart" resets board (keeps scores). {'\n'}
              8. "Reset Score" clears the scores. {'\n'}
              9. Player names are editable anytime. {'\n\n'}
              🎉 Enjoy!
            </Text>
            <Pressable onPress={() => setRulesVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={aboutVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About</Text>
            <Text>👨‍💻 Arun Gupta</Text>
            <Text>📧 garun9006@gmail.com</Text>
            <Text>🌐 github.com/ArunGuptaGIt</Text>
            <Pressable onPress={() => setAboutVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {winner ? (
        <View style={styles.centered}>
         <Animated.View style={[styles.winnerBox, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.winnerText}>{winner} Wins!</Text>
            <TouchableOpacity onPress={resetGame}>
              <Text style={styles.restartButton}>Restart</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      ) : (
        <>
          {/* Top Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tic Tac Toe 2</Text>
          </View>

          
          <View style={{alignItems:'flex-end', marginRight:normalize(25)}}>
            <View style={styles.menuRow}>
            <TouchableOpacity onPress={() => setRulesVisible(true)} style={styles.menuIcon}>
              <MaterialIcons name="rule" size={normalize(20)} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAboutVisible(true)} style={styles.menuIcon}>
              <MaterialIcons name="info-outline" size={normalize(20)} color="black" />
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={resetGame}>
              <Text style={styles.restartButton}>Restart</Text>
            </TouchableOpacity>
          </View>

         
          <View style={styles.playerSection}>
            {editingPlayer === 'player1' ? (
              <TextInput
                style={styles.nameInput}
                value={player1}
                onChangeText={(text) => handleNameChange(text, 'player1')}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <Text style={styles.playerName}>
                {player1} <TouchableOpacity onPress={() => handleEdit('player1')}>
                  <MaterialIcons style={{color:'green'}} name="edit" size={normalize(16)} />
                </TouchableOpacity> (X)
              </Text>
            )}

            {editingPlayer === 'player2' ? (
              <TextInput
                style={styles.nameInput}
                value={player2}
                onChangeText={(text) => handleNameChange(text, 'player2')}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <Text style={styles.playerName}>
                {player2} <TouchableOpacity onPress={() => handleEdit('player2')}>
                  <MaterialIcons style={{color:'green'}} name="edit" size={normalize(16)} />
                </TouchableOpacity> (O)
              </Text>
            )}
          </View>

          {/* Scorecard */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Score Card</Text>
            <Text style={styles.scoreText}>{player1}: {p1win}</Text>
            <Text style={styles.scoreText}>{player2}: {p2win}</Text>
            <TouchableOpacity onPress={resetScore}>
              <Text style={styles.resetScore}>Reset Score</Text>
            </TouchableOpacity>
          </View>

          {/* Move info */}
          <View style={styles.moveInfo}>
            <Text style={styles.moveText}>Move: {moveNumber}</Text>
            <Text style={styles.moveText}>{currentPlayer === 'X' ? player1 : player2}'s Turn ({currentPlayer})</Text>
          </View>

          {/* Game Board */}
          <View style={styles.board}>
            {tile.map((val, i) => (
              <TouchableOpacity
                key={i}
                style={moveHistory.length >= 6 && moveHistory[0] === i ? styles.blurredTile : styles.tile}
                onPress={() => fillValue(i)}
              >
                <Text style={styles.tileText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashText: { fontSize: normalize(50), fontWeight: 'bold' },
  header: { marginTop: normalize(30), alignItems: 'center' },
  title: { fontSize: normalize(32), fontWeight: 'bold' },
  menuRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: normalize(10), alignItems: 'center' },
  menuIcon: { marginLeft: normalize(10) },
  playerSection: { paddingHorizontal: 20, marginTop: normalize(10) },
  playerName: { fontSize: normalize(18), marginVertical: normalize(5), flexDirection: 'row' },
  nameInput: { fontSize: normalize(20), marginBottom: normalize(5) },
  scoreCard: {
    padding: 15, marginHorizontal: normalize(20), marginVertical: normalize(10),
    borderWidth: 1, borderColor: '#333', borderRadius: 10,
    width: width * 0.4
  },
  scoreTitle: { fontSize: normalize(18), fontWeight: 'bold', marginBottom: 5 },
  scoreText: { fontSize: normalize(16) },
  resetScore: { color: 'red', marginTop: normalize(5), fontSize: normalize(14) },
  moveInfo: { alignItems: 'center', marginTop: normalize(10) },
  moveText: { fontSize: normalize(18) },
  board: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    marginTop: normalize(20), paddingHorizontal: 20, gap: 15,
  },
  tile: {
    width: width * 0.25, height: width * 0.25,
    borderWidth: 2, borderColor: '#333',
    justifyContent: 'center', alignItems: 'center', borderRadius: 12,
  },
  blurredTile: {
    opacity: 0.4,
    width: width * 0.25, height: width * 0.25,
    borderWidth: 2, borderColor: '#333',
    justifyContent: 'center', alignItems: 'center', borderRadius: 12,
  },
  tileText: { fontSize: normalize(40) },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  winnerBox: {
    padding: 20, borderWidth: 2, borderColor: '#333',
    borderRadius: 15, backgroundColor: 'white', alignItems: 'center',
    width: width * 0.8,
  },
  winnerText: { fontSize: normalize(30), fontWeight: 'bold' },
  restartButton: { fontSize: normalize(15), color: 'red',},
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: width * 0.8, padding: 20, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: normalize(22), fontWeight: 'bold' },
  modalText: { fontSize: normalize(16), marginTop: 10, lineHeight: normalize(24) },
  modalButton: { marginTop: normalize(20), backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  modalButtonText: { color: '#fff', fontSize: normalize(16) },
});

export default App;
