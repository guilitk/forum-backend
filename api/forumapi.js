const { forumRepository } = require("../repository/forumRepository");

const { Router } = require("express");

const forumRouter = new Router();

forumRouter.get('/messages/',
    async ({ res }) => {
        try {
            const { messages } = await forumRepository.getAllMessages()
            res.status(200).json({ messages });
        } catch (error) {
            res.status(500).json({
                message: "Unknown error"
            });
        }
    });

forumRouter.get("/message/:id",
    async ({ params, res }) => {
        try {
            const { message } = await forumRepository.getMessageById(params?.id)
            res.status(200).json({ message });
        } catch (error) {
            console.log({ error });
            switch (error.status) {
                case 404:
                    res.status(404).json({
                        message: `Message with id ${params.id} was not found.`
                    });
                    break;

                default:
                    res.status(500).json({
                        message: "Unknown error"
                    });
                    break;
            }
        }
    });

forumRouter.post("/message/",
    async ({ body, protocol, headers, originalUrl, res }) => {
        try {
            console.log(body);
            const { user, message } = body
            const newMessageId = await forumRepository.createMessage({ user, message })
            const result = {
                message: "New message created.",
                endpoint: `${protocol}://${headers.host}${originalUrl}/${newMessageId}`
            };
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Unknown error"
            });
        }
    });

// forumRouter.delete("/message/:id",
//     async ({ params, res, next }) => {
//         try {
//             //await personRepository.deletePerson(params.id);
//             res.status(204).json({ message: `Mensagem ${params.id} deletada` });
//         } catch (error) {
//             res.status(500).json({
//                 message: "Unknown error"
//             });
//         }
//     });

// personRouter.put("/:id",
//     async ({ params, body, res, next }) => {
//         try {
//             await personRepository.updatePerson(body, params.id);
//             res.status(204).send();
//         } catch (error) {
//             res.status(500).json({
//                 message: "Unknown error"
//             });
//         }
//     });

module.exports = forumRouter;