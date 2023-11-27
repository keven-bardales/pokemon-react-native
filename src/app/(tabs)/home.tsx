import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

const pokePath = "https://pokeapi.co/api/v2/";
const pokeQuery = "pokemon?limit=151&offset=0";
const firstGenPokemonPath = `${pokePath}${pokeQuery}`;

const App = () => {
  const [firstGenPokemonDetails, setFirstGenPokemonDetails] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchFirstGenPokemons();
  }, []);

  const fetchFirstGenPokemons = async () => {
    try {
      const response = await fetch(firstGenPokemonPath);
      const data = await response.json();
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailsResponse = await fetch(pokemon.url);
          return await detailsResponse.json();
        })
      );
      setFirstGenPokemonDetails(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = firstGenPokemonDetails.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPokemon(filtered);
  };

  const renderPokemon = ({ item }) => {
    const types = item.types.map((type) => type.type.name).join(", ");
    const abilities = item.abilities
      .map((ability) => ability.ability.name)
      .join(", ");

    return (
      <TouchableOpacity onPress={() => navigateToDetail(item)}>
        <View style={styles.pokemonContainer}>
          <Text style={styles.pokemonTitle}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
          <Text>
            <Text style={styles.bold}>Type:</Text> {types}
          </Text>
          <Text>
            <Text style={styles.bold}>Abilities:</Text> {abilities}
          </Text>
          <Image
            style={styles.pokemonSprite}
            source={{ uri: item.sprites.front_default }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const navigateToDetail = (pokemon) => {
    router.replace(`/pokemon/${pokemon.id}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Pokemon"
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Add your detail screen UI components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 60,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
  pokemonContainer: {
    backgroundColor: "lightgrey",
    marginTop: 10,
    padding: 10,
  },
  pokemonTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pokemonSprite: {
    width: 100,
    height: 100,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default App;
