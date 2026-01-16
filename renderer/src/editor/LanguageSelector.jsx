import { 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button,
  Box 
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../core/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

export default function LanguageSelector({ currentDocument, onChangeLanguage }) {
  return (
    <Box>
      <Menu>
        <MenuButton as={Button} variant="outline" size="sm">
          {currentDocument?.language || 'Select Language'}
        </MenuButton>
        <MenuList>
          {languages.map(([language, version]) => (
            <MenuItem 
              key={language}
              onClick={() => onChangeLanguage(language)}
            >
              {language}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}