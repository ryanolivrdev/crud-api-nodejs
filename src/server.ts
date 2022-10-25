import express from 'express';
import cors from 'cors';

const app = express();

app.listen(process.env.PORT || 5500, () => console.log(`Serviço iniciado em ${new Date()}`));

app.use(cors());

app.use(express.json());

let users = [
  {
    id: 1,
    name: "Ryan Oliveira",
    avatar: "https://avatars.githubusercontent.com/u/66662333?v=4",
    city: "Belem, Pará",
  },
];

app.route("/").get((req , res) =>
  res.json({
    users,
  })
);

app.route("/:id").get((req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => Number(user.id) === Number(userId));

  if (!user) {
    return res.status(404).json("User nor found!");
  }

  res.json(user);
});

app.route("/createperson").post((req, res) => {
  const lastId = users[users.length - 1].id;

  users.push({
    id: lastId + 1,
    name: req.body.name,
    avatar: req.body.avatar,
    city: req.body.city,
  });

  res.status(201).json("Saved user");
});

app.route("/update/:id").put((req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => Number(user.id) === Number(userId));

  if (!user) {
    return res.status(404).json("User nor found!");
  }

  const updatedUser = {
    ...user,
    name: req.body.name,
    avatar: req.body.avatar,
    city: req.body.city,
  };

  users = users.map((user) => {
    if (Number(user.id) === Number(userId)) {
      user = updatedUser;
    }
    return user;
  });

  res.status(201).json("Updated user");
});

app.route("/update/:id/:patch").patch((req, res) => {
  const userId = req.params.id;
  let patch = req.params.patch;

  const user = users.find((user) => Number(user.id) === Number(userId));

  if (!user) {
    return res.status(404).json("User not found!");
  }

  let updatedUser: any

  switch (patch) {
    case "name":
      updatedUser = {
        ...user,
        name: req.body.name,
      };
      break
    case "avatar":
       updatedUser = {
        ...user,
        avatar: req.body.avatar,
      };
      break
      case "city":
        updatedUser = {
          ...user,
          city: req.body.city,
        };
        break
      default:
        return res.status(404).json("parameter not found!")
  }

  users = users.map((user) => {
    if (Number(user.id) === Number(userId)) {
      user = updatedUser;
    }
    return user;
  });

  res.status(201).json("Updated user");
});

app.route("/delete/:id").delete((req, res) => {
  const userId = req.params.id;

  users = users.filter((user) => Number(user.id) !== Number(userId));

  res.status(202).json("Deleted User");
});
