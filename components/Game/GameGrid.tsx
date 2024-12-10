import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const numberOfCellsPerRow = 3; // 3x3 grid
const cellSize = windowWidth / numberOfCellsPerRow;

interface WordPair {
  word: string;
  synonyms: string[];
}

const initialWords = ['peace', 'love', 'joy', 'calm', 'light', 'passion', 'composure', 'happiness', 'strong'];

// Fetch synonyms using DictionaryAPI
const fetchSynonyms = async (word: string): Promise<string[]> => {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const meanings = response.data[0]?.meanings || [];
    const synonyms = meanings
      .flatMap((meaning: any) => meaning.definitions.flatMap((def: any) => def.synonyms || []))
      .slice(0, 5); // Limit to 5 synonyms
    return synonyms;
  } catch (error) {
    console.error(`Error fetching synonyms for word: ${word}`, error);
    return [];
  }
};

const GameGrid: React.FC = () => {
  const [gridWords, setGridWords] = useState<WordPair[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [cellColors, setCellColors] = useState<string[]>(Array(9).fill('purple'));
  const [timer, setTimer] = useState<number>(120); // 2-minute timer

  useEffect(() => {
    initializeGrid(); // Initialize the grid on first render
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [timer]);

  const initializeGrid = async () => {
    const shuffledWords = [...initialWords].sort(() => 0.5 - Math.random()).slice(0, 6);
    const pairs: WordPair[] = [];
    for (const word of shuffledWords) {
      const synonyms = await fetchSynonyms(word);
      pairs.push({ word, synonyms });
    }

    const synonymPairs = pairs.slice(0, 3);
    const randomWords = pairs.slice(3).map((pair) => ({ word: pair.word, synonyms: [] }));
    const allWords = [...synonymPairs, ...synonymPairs, ...randomWords]
      .slice(0, 9)
      .sort(() => 0.5 - Math.random());

    setGridWords(allWords);
    setCellColors(Array(9).fill('purple'));
    setSelectedCells([]);
    setTimer(120); // Reset the timer when grid initializes
  };

  const handleCellPress = (index: number) => {
    if (selectedCells.length === 0) {
      setSelectedCells([index]);
      updateCellColors(index, 'yellow');
    } else if (selectedCells.length === 1) {
      const [firstIndex] = selectedCells;
      const firstWord = gridWords[firstIndex];
      const secondWord = gridWords[index];

      const isMatch =
        firstWord.synonyms.includes(secondWord.word) || secondWord.synonyms.includes(firstWord.word);

      if (isMatch && firstIndex !== index) {
        updateCellColors(firstIndex, 'green');
        updateCellColors(index, 'green');
        setTimeout(() => replaceMatchedCells(firstIndex, index), 500);
      } else {
        updateCellColors(firstIndex, 'purple');
        updateCellColors(index, 'red');
        setTimeout(() => resetCellColors(firstIndex, index), 500);
      }
      setSelectedCells([]);
    }
  };

  const updateCellColors = (index: number, color: string) => {
    setCellColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[index] = color;
      return newColors;
    });
  };

  const resetCellColors = (firstIndex: number, secondIndex: number) => {
    updateCellColors(firstIndex, 'purple');
    updateCellColors(secondIndex, 'purple');
  };

  const replaceMatchedCells = async (firstIndex: number, secondIndex: number) => {
    const newWords = [...gridWords];
    for (const index of [firstIndex, secondIndex]) {
      const randomWord = initialWords[Math.floor(Math.random() * initialWords.length)];
      const synonyms = await fetchSynonyms(randomWord);
      newWords[index] = { word: randomWord, synonyms };
    }
    setGridWords(newWords);
    resetCellColors(firstIndex, secondIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vorduku</Text>
      <Text style={styles.timerText}>
        Time Remaining: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
      </Text>
      <View style={styles.grid}>
        {gridWords.map((pair, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.cell, { backgroundColor: cellColors[index] }]}
            onPress={() => handleCellPress(index)}
          >
            <Text style={styles.cellText}>{pair.word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Reset Timer" onPress={initializeGrid} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50, // Push everything down from the top
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20, // Space between title and timer
  },
  timerText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth,
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'purple',
  },
  cellText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GameGrid;
