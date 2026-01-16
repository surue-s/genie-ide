import React from 'react'
import {createRoot} from "react-dom/client"
import App from './App'
import { ChakraProvider } from '@chakra-ui/react';

delete window.require;
delete window. define;

const root = createRoot(document. getElementById('root'));
root.render(
        <App />

)