export default function (port: number, host: string): () => void {
	return () => {
		console.log(`Server running at ${host}:${port}`);
	};
}
