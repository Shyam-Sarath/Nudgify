export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001',
      eas: {
        projectId: '7e15c4aa-aaf8-4740-b119-e5ed0ee4d527',
      },
    },
  };
};
