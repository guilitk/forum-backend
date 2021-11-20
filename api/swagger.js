const packageInfo = require("../package.json");

module.exports = {
    openapi: "3.0.3",
    info: {
        title: packageInfo.name,
        version: packageInfo.version
    },
    servers: [
        {
            url: `http://${process.env.HOST}:${process.env.PORT}${process.env.API_PATH}`
        }
    ],
    paths: {
        '/messages/': {
            get: {
                description: "Get all the messages",
                responses: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: "#/components/schemas/Messages"
                                }
                            }
                        }
                    },
                    500: {
                        description: "Unknown error occurred",
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        '/message/{id}': {
            get: {
                description: "Get a specific message",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID of the message that one wants to retrieve",
                        required: true,
                        schema: {
                            $ref: "#/components/schemas/id"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Message was obtained",
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: "#/components/schemas/Message"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Message was not found",
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                }
                            }
                        }
                    },
                    500: {
                        description: "Unknown error occurred",
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            id: {
                type: "string",
                description: "Unique identifier of the message",
                example: "950d858c-f9e6-4fa2-9e15-6627c6415b9d"
            },
            user: {
                type: "string",
                description: "Username",
                example: "John Doe"
            },
            message: {
                type: "string",
                description: "Content of the message",
                example: "This is a message from the forum posted from some user."
            },
            date: {
                type: "string",
                description: "Date when the message was posted.",
                example: "1984-07-13"
            },
            Message: {
                type: "object",
                properties: {
                    user: {
                        $ref: "#/components/schemas/user"
                    },
                    message: {
                        $ref: "#/components/schemas/message"
                    },
                    id: {
                        $ref: "#/components/schemas/id"
                    },
                    date: {
                        $ref: "#/components/schemas/date"
                    }
                }
            },
            Messages: {
                properties: {
                    messages: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Message"
                        }
                    }
                }
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Message describing the error occurred",
                        example: "Description of the error"
                    }
                }
            }
        }
    }
}