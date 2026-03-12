import {
    type RouteConfig,
    index,
    layout,
} from "@react-router/dev/routes";

export default [
    layout("./layouts/mainlayout.tsx", [
        index("./routes/home.tsx"),
        // route("rides",     "./routes/rides.tsx"),
        // route("community", "./routes/community.tsx"),
        // route("equipment", "./routes/equipment.tsx"),
        // route("routes",    "./routes/routes.tsx"),
        // route("blog",      "./routes/blog.tsx"),
    ]),
] satisfies RouteConfig;