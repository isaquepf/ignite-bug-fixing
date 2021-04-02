const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistsRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository)
    return response.status(404).json({ error: "Repository not found" });

  const repositoryIndex = repositories.indexOf(repository);

  if (repositoryIndex === -1)
    return response.status(404).json({ error: 'Repository not found' });

  request.repositoryIndex = repositoryIndex

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkExistsRepository, (request, response) => {
  const { repository, repositoryIndex } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checkExistsRepository, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkExistsRepository, (request, response) => {
  const { repository, repositoryIndex } = request;

  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
