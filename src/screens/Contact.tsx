import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { BsGithub, BsLinkedin, BsPerson, BsTwitter } from "react-icons/bs";
import { MdEmail, MdOutlineEmail } from "react-icons/md";
import { portfolio } from "@config";
import { IconLink } from "@components";
import { Field, Form, Formik } from "formik";

type FormValues = { name?: string; email?: string; message?: string };

export const Contact = () => {
  const { hasCopied, onCopy } = useClipboard(portfolio.email);

  return (
    <Box>
      <VStack spacing={{ base: 2, md: 4, lg: 16 }}>
        <Heading
          fontSize={{
            base: "4xl",
            md: "5xl",
          }}>
              Get in Touch
        </Heading>

        <Stack
          spacing={{ base: 2, md: 4, lg: 16 }}
          direction={{ base: "column", md: "row" }}>
          <Stack
            align="center"
            justify="space-around"
            direction={{ base: "row", md: "column" }}>
            <Tooltip
              label={hasCopied ? "Email Copied!" : "Copy Email"}
              closeOnClick={false}
              hasArrow>
              <IconButton
                aria-label="email"
                variant="ghost"
                size="lg"
                fontSize="3xl"
                icon={<MdEmail />}
                _hover={{
                  bg: "blue.500",
                  color: useColorModeValue("white", "gray.700"),
                }}
                onClick={onCopy}
                isRound
              />
            </Tooltip>

            <IconLink
              to={portfolio.github}
              icon={<BsGithub />}
              label={"github"}
              btnProps={{
                fontSize: "3xl"
              }}
            />
            <IconLink
              to={portfolio.twitter}
              icon={<BsTwitter size="28px" />}
              label={"twitter"}
            />
            <IconLink
              to={portfolio.linkedin}
              icon={<BsLinkedin size="28px" />}
              label={"linkedin"}
            />
          </Stack>

          <Box
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            p={6}
            color={useColorModeValue("gray.700", "whiteAlpha.900")}
            shadow="base">
            <Formik<FormValues>
              initialValues={{ name: undefined, email: undefined, message: undefined }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  actions.setSubmitting(false);
                }, 1000);
              }}
            >
              {(props) => (
                <Form>
                  <Field name='name'>
                    {() => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel htmlFor='name'>Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <BsPerson />
                          </InputLeftElement>
                          <Input type="text" id="name" name="name" placeholder="Your Name" />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='email'>
                    {() => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <MdOutlineEmail />
                          </InputLeftElement>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Your Email"
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='message'>
                    {() => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          rows={6}
                          resize="none"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    isLoading={props.isSubmitting}
                    type='submit'
                    colorScheme="blue"
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: "blue.500",
                    }}
                    isFullWidth>
                    Send Message
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </VStack>
    </Box>
  );
};
