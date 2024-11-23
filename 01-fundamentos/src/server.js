import http from "node:http";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-paramers.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;


  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const body =Buffer.concat(buffers).toString();
  console.log(body.email);

  try{
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch{
    req.body = null
  }

 const route = routes.find(route =>{
    return route.method == method && route.path.test(url)
 })
 console.log(route)
 
 if(route){

  const routeParams = req.url.match(route.path)

  const {query, ...params} = routeParams.groups
  
  req.params = params
  req.query = query ? extractQueryParams(query) : {}

  return route.handler(req , res);
 }

  return res.writeHead(440).end();
});

server.listen(2000);