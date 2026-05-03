import { Box, Flex, Spinner } from '@amdlre/design-system';

export default function Loading() {
  return (
    <Flex align="center" justify="center" className="min-h-[60vh]">
      <Box className="h-12 w-12">
        <Spinner className="h-12 w-12 text-brand-accent" />
      </Box>
    </Flex>
  );
}
