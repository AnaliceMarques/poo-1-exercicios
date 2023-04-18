import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { Video } from "./models/Video";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const videosDB = await db("videos");

    const videos = videosDB.map((videoDB) => {
      return new Video(
        videoDB.id,
        videoDB.title,
        videoDB.duration,
        videoDB.upload
      );
    });

    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' deve ser string");
    }

    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser number");
    }

    const [videoDBExists] = await db("videos").where({ id });

    if (videoDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newVideo = new Video(id, title, duration);

    // const newVideoDB = {
    //   id: newVideo.getId(),
    //   title: newVideo.getTitle(),
    //   duration: newVideo.getDuration(),
    //   upload: newVideo.getUpload(),
    // };

    //como o nome das propiedades são iguais eu posso inserir direto
    await db("videos").insert(newVideo);

    const [videoDB] = await db("videos").where({ id });

    res.status(201).send({ message: "Vídeo enviado com sucesso", videoDB });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const { title, duration } = req.body;

    const [videoToUpdate] = await db("videos").where({ id });

    if (!videoToUpdate) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    if (!title && !duration) {
      res.status(400);
      throw new Error(
        "'title' e/ou 'duration' devem existir para fazer a edição"
      );
    }

    if (title !== undefined) {
      if (typeof title !== "string") {
        res.status(400);
        throw new Error("'title' deve ser string");
      }
    }

    if (duration !== undefined) {
      if (typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' deve ser number");
      }
    }

    const newTitle = title || videoToUpdate.title;
    const newDuration = duration || videoToUpdate.duration;

    const video = new Video(
      videoToUpdate.id,
      videoToUpdate.title,
      videoToUpdate.duration,
      videoToUpdate.upload
    );

    video.setTitle(newTitle);
    video.setDuration(newDuration);

    await db("videos").update(video).where({ id });

    res.status(200).send({ message: "Vídeo atualizado", video });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [idExist] = await db("videos").where({ id });

    if (!idExist) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    await db("videos").del().where({ id });

    res.status(200).send({ message: "Vídeo excluído com sucesso" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
