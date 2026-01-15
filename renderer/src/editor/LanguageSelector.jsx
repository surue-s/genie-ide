import { Button, Menu, Portal } from "@chakra-ui/react"
import { LANGUAGE_VERSIONS } from "../core/constants"

const languages = Object.entries(LANGUAGE_VERSIONS)
const LanguageSelector = ({}) => {
  return (
    <Box>
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            languages.map(([language, version]) => (
              <Menu.Item key={language}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeLanguage(doc, language)}
                >
                  {language}
                </Button>
              </Menu.Item>
            ))
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    </Box>
  )
}