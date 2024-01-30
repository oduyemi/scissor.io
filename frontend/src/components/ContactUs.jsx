import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "./elements/Button";
import axios from "axios";




export const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        sendCopy: false,
      });

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post("http://your-api-url/message", formData);

          console.log("Message sent successfully:", response.data);
          
        } catch (error) {
            
          console.error("Error sending message:", error);
      
        }
      };
    return(
        <Box className="container my-12 mx-auto md:px-6 text-white">
        <section className="mb-8">
            <Box className="flex justify-center">
            <Box className="text-center md:max-w-xl lg:max-w-3xl">
                <Typography
                variant="h2"
                className="mb-12 px-6 text-3xl text-pry"
                sx={{fontSize: "bold" }}>
                    Contact us</Typography>
            </Box>
            </Box>

            <Box className="flex flex-wrap">
            <Box className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                <form onSubmit={handleSubmit}>
                <Box className="relative mb-6" data-te-input-wrapper-init>
                    <input type="text"
                        className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] px-3 leading-[1.6]
                        outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100
                        data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none"
                        name="name" placeholder="Name" 
                        onChange={handleChange}
                    />
                </Box>
                <Box className="relative mb-6" data-te-input-wrapper-init>
                    <input type="email"
                        className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] px-3 leading-[1.6]
                        outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100
                        data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none"
                        name="email" placeholder="Email address"
                        onChange={handleChange}
                    />
                    
                </Box>
                <Box className="relative mb-6" data-te-input-wrapper-init>
                    <textarea
                        className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] px-3 leading-[1.6]
                        outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100
                        data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none"
                        name="message" rows="3" placeholder="Your message"
                        onChange={handleChange}>
                    </textarea>
                </Box>
                <Box className="mb-6 inline-block min-h-[1.5rem] justify-center pl-[1.5rem] md:flex">
                    <input
                        className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem]
                        appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300
                        outline-none before:pointer-events-none before:absolute before:h-[0.875rem]
                        before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent
                        before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-['']
                        checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute
                        checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem]
                        checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem]
                        checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid
                        checked:after:border-white checked:after:bg-transparent checked:after:content-['']
                        hover:cursor-pointer hover:before:opacity-[0.04]
                        hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none
                        focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12]
                        focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)]
                        focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1]
                        focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem]
                        focus:after:content-[''] checked:focus:before:scale-100
                        checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]
                        checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem]
                        checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem]
                        checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem]
                        checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid
                        checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600
                        dark:checked:border-primary dark:checked:bg-primary
                        dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)]
                        dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value=""
                        name="sendCopy"
                        onChange={handleChange}
                    />
                    <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="exampleCheck96">
                    Send me a copy of this message
                    </label>
                </Box>
                <Button 
                type="submit"
                className="mb-6 inline-block w-full rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out">Send</Button>
               
                </form>
            </Box>
            <Box className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                <Box className="flex flex-wrap">
                <Box className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <Box className="flex items-start mt-8">
                    <Box className="shrink-0">
                        <Box className="inline-block rounded-md bg-primary-100 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                        </svg>
                        </Box>
                    </Box>
                    <Box className="ml-6 grow">
                        <p className="mb-2 font-bold text-pee">
                        Technical support
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        support@scissor.io
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        +1 234-567-89
                        </p>
                    </Box>
                    </Box>
                </Box>
                <Box className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <Box className="flex items-start mt-8">
                    <Box className="shrink-0">
                        <Box className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        </Box>
                    </Box>
                    <Box className="ml-6 grow">
                        <p className="mb-2 font-bold text-pee">
                        Sales questions
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        sales@scissor.io
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        +1 234-567-89
                        </p>
                    </Box>
                    </Box>
                </Box>
                <Box className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <Box className="align-start flex">
                    <Box className="shrink-0">
                        <Box className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                        </Box>
                    </Box>
                    <Box className="ml-6 grow">
                        <p className="mb-2 font-bold text-pee">Enquiries</p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        info@scissor.io
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        +234 123 567 40899
                        </p>
                    </Box>
                    </Box>
                </Box>
                <Box className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <Box className="align-start flex">
                    <Box className="shrink-0">
                        <Box className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                        </svg>
                        </Box>
                    </Box>
                    <Box className="ml-6 grow">
                        <p className="mb-2 font-bold text-pee">Bug report</p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        bugs@scissor.io
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                        +234 123 567 4089
                        </p>
                    </Box>
                    </Box>
                </Box>
                </Box>
            </Box>
            </Box>
        </section>
        </Box>
    )
}