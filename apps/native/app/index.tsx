import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Home() {
	const router = useRouter();
	return (
		<Container>
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
			>
				<View className="flex-1 items-center justify-center px-6 py-12">
					<Text className="mb-2 font-bold text-5xl text-slate-900 dark:text-white">Welcome to</Text>
					<Text className="mb-8 font-bold text-5xl text-blue-600 dark:text-blue-400">Habits</Text>

					<Text className="mb-12 text-center text-lg text-slate-600 dark:text-slate-300">
						Build better habits, one day at a time
					</Text>

					<View className="w-full max-w-sm space-y-4">
						<Pressable
							className="rounded-2xl bg-blue-600 px-6 py-4 shadow-lg active:bg-blue-700"
							onPress={() => router.push("/signin")}
						>
							<Text className="text-center font-semibold text-lg text-white">Sign In</Text>
						</Pressable>

						<Pressable
							className="mt-4 rounded-2xl border-2 border-blue-600 bg-transparent px-6 py-4 text-blue-600 active:bg-blue-50 dark:text-blue-400 dark:active:bg-blue-900/20"
							onPress={() => router.push("/signup")}
						>
							<Text className="text-center font-semibold text-blue-600 text-lg dark:text-blue-400">Create Account</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
