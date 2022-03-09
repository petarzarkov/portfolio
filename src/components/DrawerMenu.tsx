import React, { FC, useRef } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Drawer, DrawerBody, DrawerContent, Button, DrawerFooter, Link,
  DrawerHeader, DrawerOverlay, useDisclosure, DrawerCloseButton, HStack
} from "@chakra-ui/react";
import { BsGithub, BsLinkedin } from "react-icons/bs";

export const DrawerMenu: FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <div>
      <Button
        ref={btnRef}
        colorScheme='teal'
        onClick={onOpen}
      >
        <ArrowRightIcon />
      </Button>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen} finalFocusRef={btnRef} >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton>
            <ArrowLeftIcon />
          </DrawerCloseButton>
          <DrawerHeader borderBottomWidth='1px'>Portfolio</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Link colorScheme='blue' href='https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/' target="_blank" >
                <BsLinkedin />
              </Link>
              <Link colorScheme='gray' href='https://github.com/petarzarkov?tab=repositories' target="_blank" >
                <BsGithub />
              </Link>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {children}
    </div>
  );
};