import React from 'react'
import { Box } from '@chakra-ui/react'

const Output = () => {
  return (
    <Box w ='50%'>
        <Text fontsize="md" mb = "4" >
            <Button 
            variant="outline"
            size="sm"
            colorscheme="blue"
            mb = {4}>
                Run Code
            </Button>
            <Box
            border="1px"
            height = '75vh'
            padding = '4'
            borderColor = 'gray.200'
            borderRadius = 'md'>
                AAAAAA


            </Box>

        </Text>
        
    </Box>
)
}

export default Output