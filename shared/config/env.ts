function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Every variable listed here must also be named in .env.example.
export const env = {
  DATABASE_URL: required("DATABASE_URL"),
};
