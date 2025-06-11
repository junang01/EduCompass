"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, context) => {
    const ctx = graphql_1.GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (!request.user) {
        console.error('사용자 정보를 찾을 수 없습니다. 인증이 필요합니다.');
    }
    return request.user;
});
//# sourceMappingURL=current-user.decorator.js.map