import { ScrollView, Text } from "react-native";
import { Container } from "@/components/container";

export default function SignUp() {
	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="flex-1">
				<Text className="mb-4 font-bold font-mono text-3xl text-foreground">SIGNUP</Text>
			</ScrollView>
		</Container>
	);
}
