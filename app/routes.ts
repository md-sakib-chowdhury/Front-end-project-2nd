import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [



    layout("./layouts/mainlayout.tsx", [
        index("./routes/home.tsx"),
     
        // route("about", "./routes/about.tsx"),
        // route("services", "./routes/services.tsx"),
        // route("blog", "./routes/blog.tsx"),
        // route("contract", "./routes/contract.tsx"),
    ]),


] satisfies RouteConfig;
