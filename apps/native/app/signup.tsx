import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
	const { isLoaded, signUp, setActive } = useSignUp();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [pendingVerification, setPendingVerification] = React.useState(false);
	const [code, setCode] = React.useState("");

	// Handle submission of sign-up form
	const onSignUpPress = async () => {
		if (!isLoaded) return;

		// Start sign-up process using email and password provided
		try {
			await signUp.create({
				emailAddress,
				password,
			});

			// Send user an email with verification code
			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			// Set 'pendingVerification' to true to display second form
			// and capture OTP code
			setPendingVerification(true);
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	// Handle submission of verification form
	const onVerifyPress = async () => {
		if (!isLoaded) return;

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === "complete") {
				await setActive({ session: signUpAttempt.createdSessionId });
				router.replace("/");
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	if (pendingVerification) {
		return (
			<View className="flex-1 bg-gradient-to-br from-green-50 to-green-200 px-6 py-12 dark:from-green-900 dark:to-green-800">
				<Text className="mb-6 text-center font-bold text-3xl text-gray-900 dark:text-white">Verify email</Text>
				<TextInput
					className="mb-6 rounded border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
					value={code}
					placeholder="Enter verification code"
					onChangeText={(code) => setCode(code)}
				/>
				<TouchableOpacity
					onPress={onVerifyPress}
					className="mb-4 rounded-xl bg-green-600 px-4 py-3 shadow active:bg-green-700"
				>
					<Text className="text-center font-semibold text-lg text-white">Verify</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-900 dark:to-slate-800">
			<Text className="mb-6 text-center font-bold text-3xl text-gray-900 dark:text-white">Sign up</Text>
			<TextInput
				className="mb-4 rounded border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
				autoCapitalize="none"
				value={emailAddress}
				placeholder="Enter email"
				onChangeText={(email) => setEmailAddress(email)}
			/>
			<TextInput
				className="mb-6 rounded border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
				value={password}
				placeholder="Enter password"
				secureTextEntry={true}
				onChangeText={(password) => setPassword(password)}
			/>
			<TouchableOpacity
				onPress={onSignUpPress}
				className="mb-4 rounded-xl bg-blue-600 px-4 py-3 shadow active:bg-blue-700"
			>
				<Text className="text-center font-semibold text-lg text-white">Continue</Text>
			</TouchableOpacity>
			<View className="mt-6 flex-row justify-center gap-2">
				<Text className="text-gray-600 dark:text-gray-300">Already have an account?</Text>
				<Link href="/signin">
					<Text className="font-medium text-blue-600 dark:text-blue-400">Sign in</Text>
				</Link>
			</View>
		</View>
	);
}
