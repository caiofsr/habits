import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Home() {
	const router = useRouter();
	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="flex-1">
				<Text className="mb-4 font-bold font-mono text-3xl text-foreground">HOME</Text>
				<View className="mt-6 space-y-4 px-4">
					<Pressable className="rounded bg-blue-500 px-4 py-2" onPress={() => router.push("/sing-in")}>
						<Text className="text-center text-white">Sign In</Text>
					</Pressable>
					<Pressable className="rounded bg-green-500 px-4 py-2" onPress={() => router.push("/signup")}>
						<Text className="text-center text-white">Sign Up</Text>
					</Pressable>
				</View>
			</ScrollView>
		</Container>
	);
}
