interface EnvConfig {
  baseUrl: string;
}

export const environment: Readonly<EnvConfig> = {
  baseUrl:
    process.env.BASE_URL || 'https://todomvc.com/examples/react-redux/dist/',
};
