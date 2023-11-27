import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const PokemonDetail = () => {
  const params = useGlobalSearchParams() as { id: string };
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.id}`
        );
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        setError("Error fetching Pokemon details");
      }
    };

    fetchPokemonDetails();
  }, [params.id]);

  const handlePreviousPokemon = () => {
    router.replace(`pokemon/${parseInt(params.id, 10) - 1}`);
  };

  const handleNextPokemon = () => {
    router.replace(`pokemon/${parseInt(params.id, 10) + 1}`);
  };

  if (!pokemonDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const types = pokemonDetails.types.map((type) => type.type.name).join(", ");
  const abilities = pokemonDetails.abilities
    .map((ability) => ability.ability.name)
    .join(", ");

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: pokemonDetails.sprites.other["official-artwork"].front_default,
        }}
        style={styles.pokemonImage}
      />
      <Text style={styles.pokemonName}>
        {pokemonDetails.name.charAt(0).toUpperCase() +
          pokemonDetails.name.slice(1)}
      </Text>
      <Text>
        <Text style={styles.bold}>Type:</Text> {types}
      </Text>
      <Text>
        <Text style={styles.bold}>Abilities:</Text> {abilities}
      </Text>

      <View style={styles.navigationButtons}>
        {parseInt(params.id, 10) > 1 && (
          <TouchableOpacity onPress={handlePreviousPokemon}>
            <Text style={styles.navigationText}>Previous Pokemon</Text>
          </TouchableOpacity>
        )}
        {parseInt(params.id, 10) < 151 && (
          <TouchableOpacity onPress={handleNextPokemon}>
            <Text style={styles.navigationText}>Next Pokemon</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationText: {
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PokemonDetail;
