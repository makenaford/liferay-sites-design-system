import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Link, LinkInline, Pagination } from "./Links";

const meta: Meta = {
  title: "Actions/Links & Pagination",
};
export default meta;

export const Links: StoryObj = {
  render: () => (
    <div className="demo-row">
      <Link href="#">Primary link</Link>
      <Link variant="neutral" href="#">Neutral link</Link>
      <Link variant="visited" href="#">Visited link</Link>
      <Link disabled>Disabled link</Link>
      <LinkInline href="#">Read the guide</LinkInline>
    </div>
  ),
};

export const PaginationDemo: StoryObj = {
  name: "Pagination",
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
  },
};
