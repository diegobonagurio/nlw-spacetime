import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/Feather";

import NLWLogo from "../src/assets/logo.svg";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { api } from "../src/lib/api";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

dayjs.locale(ptBR);

interface Memory {
  coverUrl: string;
  excerpt: string;
  id: string;
  createdAt: string;
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await api.get("/memories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMemories(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 px-8 flex-row items-center justify-between">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#fff" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-bold text-sm text-gray-100">
                {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{ uri: memory.coverUrl }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href="/memories/:id">
                <TouchableOpacity className="flew-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
