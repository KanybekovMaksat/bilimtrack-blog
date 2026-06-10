import type { GetServerSideProps } from "next";

/** The site front door is the blog. */
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/blog", permanent: false },
});

export default function HomeRedirect() {
  return null;
}
