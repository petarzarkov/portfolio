import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
  Tooltip,
  VStack,
  useClipboard,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsPerson } from 'react-icons/bs';
import { MdEmail, MdOutlineEmail } from 'react-icons/md';
import { email, portfolio } from '@config';
import { BaseModal, Socials, Title } from '@components';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import emailjs from '@emailjs/browser';

interface FormValues {
  name?: string;
  email?: string;
  message?: string;
}

export const Contact = () => {
  const { hasCopied, onCopy } = useClipboard(portfolio.email),
    [showModal, setShowModal] = useState<{ show: true; response: string } | { show: false; response?: string }>({
      show: false,
    }),
    sendEmail = (values: FormValues, actions: FormikHelpers<FormValues>) =>
      emailjs
        .send(
          email.serviceId,
          email.templateId,
          {
            from_name: values.name,
            message: values.message,
            reply_to: values.email,
          },
          email.userId,
        )
        .then(
          () => {
            setShowModal({ show: true, response: 'Email sent.' });
            actions.setSubmitting(false);
          },
          () => {
            setShowModal({ show: true, response: 'Error on sending email.' });
            actions.setSubmitting(false);
          },
        );

  return (
    <Box>
      <Title title={'Get in Touch'} subTitle={'Email me or contact me on any of my social links.'} />
      {showModal.show && (
        <BaseModal
          title="Email"
          content={showModal.response}
          isOpen={showModal.show}
          onClose={() => setShowModal({ show: false })}
        />
      )}
      <VStack spacing={{ base: 2, md: 4, lg: 22 }}>
        <Stack spacing={{ base: 2, md: 4, lg: 22 }} direction={{ base: 'column', md: 'row' }}>
          <Stack align="center" justify="space-around" direction={{ base: 'row', md: 'column' }}>
            <Tooltip label={hasCopied ? 'Email Copied!' : 'Copy Email'} closeOnClick={false} hasArrow>
              <IconButton
                aria-label="email"
                variant="ghost"
                size="lg"
                fontSize="3xl"
                icon={<MdEmail />}
                _hover={{
                  bg: useColorModeValue('primary.700', 'primary.50'),
                  color: useColorModeValue('primary.50', 'primary.700'),
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
            bg={useColorModeValue('primary.50', 'primary.700')}
            borderRadius="lg"
            p={6}
            color={useColorModeValue('primary.700', 'primary.50')}
            shadow="base"
          >
            <Formik<FormValues>
              initialValues={{ name: undefined, email: undefined, message: undefined }}
              onSubmit={sendEmail}
            >
              {(props) => (
                <Form>
                  <Field name="name">
                    {({ field }: { field: Record<string, unknown> }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <BsPerson />
                          </InputLeftElement>
                          <Input {...field} type="text" id="name" placeholder="Your Name" />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field }: { field: Record<string, unknown> }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <MdOutlineEmail />
                          </InputLeftElement>
                          <Input {...field} id="email" type="email" placeholder="Your Email" />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="message">
                    {({ field }: { field: Record<string, unknown> }) => (
                      <FormControl isRequired marginBottom={5}>
                        <FormLabel>Message</FormLabel>
                        <Textarea {...field} id="message" placeholder="Your Message" rows={6} resize="none" />
                      </FormControl>
                    )}
                  </Field>
                  <Center>
                    <Button
                      isLoading={props.isSubmitting}
                      type="submit"
                      colorScheme="blue"
                      bg={useColorModeValue('primary.300', 'primary.500')}
                      color="white"
                      _hover={{
                        bg: useColorModeValue('primary.200', 'primary.400'),
                      }}
                    >
                      Send Message
                    </Button>
                  </Center>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </VStack>
    </Box>
  );
};
