import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Page() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = React.useState("");
	const [password, setPassword] = React.useState("");

	// Handle the submission of the sign-in form
	const onSignInPress = async () => {
		if (!isLoaded) return;

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});

			// If sign-in process is complete, set the created session as active
			// and redirect the user
			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace("/");
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 px-6 py-12 dark:from-blue-900 dark:to-blue-800">
			<Text className="mb-6 text-center font-bold text-3xl text-gray-900 dark:text-white">Sign in</Text>
			<TextInput
				className="mb-4 rounded border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
				autoCapitalize="none"
				value={emailAddress}
				placeholder="Enter email"
				onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
			/>
			<TextInput
				className="mb-6 rounded border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
				value={password}
				placeholder="Enter password"
				secureTextEntry={true}
				onChangeText={(password) => setPassword(password)}
			/>
			<TouchableOpacity
				onPress={onSignInPress}
				className="mb-4 rounded-xl bg-blue-600 px-4 py-3 shadow active:bg-blue-700"
			>
				<Text className="text-center font-semibold text-lg text-white">Continue</Text>
			</TouchableOpacity>
			<View className="mt-6 flex-row justify-center gap-2">
				<Text className="text-gray-600 dark:text-gray-300">Don't have an account?</Text>
				<Link href="/signup">
					<Text className="font-medium text-blue-600 dark:text-blue-400">Sign up</Text>
				</Link>
			</View>
		</View>
	);
}
