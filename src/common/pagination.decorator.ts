import { createParamDecorator, ExecutionContext } from "@nestjs/common";

function parseNumberWithDefault(str: string, defaultValue: number) {
  const num = Number(str);
  return Number.isNaN(num) ? defaultValue : num;
}

export const PaginationQuery = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const { query } = ctx.switchToHttp().getRequest();
  const page = parseNumberWithDefault(query.page, 1);
  const limit = parseNumberWithDefault(query.limit, 10);
  return {
    page,
    limit,
  };
});
