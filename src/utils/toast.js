export function useToast() {
  return {
    toast: ({ title }) => {
      console.log(title);
    },
  };
}
