import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import { BsPerson } from "react-icons/bs";
import { MdEmail, MdOutlineEmail } from "react-icons/md";
import { portfolio, email } from "@config";
import { BaseModal, Socials, Title } from "@components";
import { Field, Form, Formik, FormikHelpers } from "formik";
import emailjs from "@emailjs/browser";

type FormValues = { name?: string; email?: string; message?: string };

export const Contact = () => {
  const { hasCopied, onCopy } = useClipboard(portfolio.email);
  const [showModal, setShowModal] = useState<{ show: true; response: string } | { show: false; response?: string }>({ show: false });
  const sendEmail = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    return emailjs.send(email.serviceId, email.templateId, {
      from_name: values.name,
      message: values.message,
      reply_to: values.email
    }, email.userId)
      .then(() => {
        setShowModal({ show: true, response: "Email sent." });
        actions.setSubmitting(false);
      }, () => {
        setShowModal({ show: true, response: "Error on sending email." });
        actions.setSubmitting(false);
      });
  };

  return (
    <Box>
      {showModal.show &&
      <BaseModal title="Email" content={showModal.response} isOpen={showModal.show} onClose={() => setShowModal({ show: false })} />}
      <VStack spacing={{ base: 2, md: 4, lg: 22 }}>
        <Title
          title={"Get in Touch"}
          subTitle={"Email me or contact me on any of my social links."}
        />

        <Stack
          spacing={{ base: 2, md: 4, lg: 22 }}
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

            <Socials.GitHub />
            <Socials.Twitter />
            <Socials.LinkedIn />
          </Stack>

          <Box
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            p={6}
            color={useColorModeValue("gray.700", "whiteAlpha.900")}
            shadow="base">
            <Formik<FormValues>
              initialValues={{ name: undefined, email: undefined, message: undefined }}
              onSubmit={sendEmail}
            >
              {(props) => (
                <Form>
                  <Field name='name'>
                    {({ field }: { field: unknown }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel htmlFor='name'>Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <BsPerson />
                          </InputLeftElement>
                          <Input {...field} type="text" id="name" placeholder="Your Name" />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='email'>
                    {({ field }: { field: unknown }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <MdOutlineEmail />
                          </InputLeftElement>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="Your Email"
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='message'>
                    {({ field }: { field: unknown }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          {...field}
                          id="message"
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
