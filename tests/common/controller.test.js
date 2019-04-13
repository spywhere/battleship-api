/* global expect */
const Controller = require("../../common/controller");
const errors = require("../../common/errors");

const controllers = {
    hello: Controller.mock({
        perform: async() => ({
            message: "hello world"
        })
    }),
    reject: Controller.mock({
        perform: async() => {
            throw new errors.BadRequestError("Rejected");
        }
    })
};

describe("Controller", () => {
    it("should support a basic controller", async() => {
        const response = await controllers.hello.perform();

        expect(response).toMatchObject({
            message: "hello world"
        });
    });

    it("should support a basic rejection controller", async() => {
        try {
            await controllers.reject.perform();
        } catch (error) {
            expect(error).toMatchObject({
                statusCode: 400,
                message: "Rejected"
            });
        }
    });
});
