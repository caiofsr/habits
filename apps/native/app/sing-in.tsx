import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";

export default function SignIn() {
	const router = useRouter();
	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-6">
				<View className="space-y-4 py-8">
					<Text className="mb-4 font-bold font-mono text-3xl text-foreground">SIGNIN</Text>
					<Pressable className="rounded bg-blue-500 px-4 py-2" onPress={() => router.replace("/(authed)/(tabs)")}>
						<Text className="text-center text-white">Continue</Text>
					</Pressable>
				</View>
			</ScrollView>
		</Container>
	);
}
