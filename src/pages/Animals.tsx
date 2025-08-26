import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  AnimalCard,
} from "../styles/Animals.styled";

interface Animal {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular: boolean;
  isStock: boolean;
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useLocalStorage<Animal[]>("animals", []);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/Animal`, {
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    })
      .then((res) => res.json())
      .then((data: Animal[]) => {
        setAnimals((prev) => {
          const newAnimals = data.filter(
            (a) => !prev.some((p) => p.id === a.id)
          );
          return [...prev, ...newAnimals];
        });
      })
      .catch(console.error);
  }, [setAnimals]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newAnimal: Animal = {
      id: crypto.randomUUID(),
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      description: String(formData.get("description") || ""),
      isPopular: formData.get("isPopular") === "on",
      isStock: formData.get("isStock") === "on",
    };

    await fetch(`${import.meta.env.VITE_BASE_URL}/Animal`, {
      method: "POST",
      body: JSON.stringify(newAnimal),
      headers: {
        "Content-Type": "application/json",
        "x-bypass-token": import.meta.env.VITE_API_KEY,
      },
    });

    setAnimals((prev) => [...prev, newAnimal]);
    form.reset();
  };

  const handleEdit = (animal: Animal) => setEditingAnimal(animal);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAnimal) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedAnimal: Animal = {
      ...editingAnimal,
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      description: String(formData.get("description") || ""),
      isPopular: formData.get("isPopular") === "on",
      isStock: formData.get("isStock") === "on",
    };

    await fetch(`${import.meta.env.VITE_BASE_URL}/Animal/${editingAnimal.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedAnimal),
      headers: {
        "Content-Type": "application/json",
        "x-bypass-token": import.meta.env.VITE_API_KEY,
      },
    });

    setAnimals((prev) =>
      prev.map((a) => (a.id === editingAnimal.id ? updatedAnimal : a))
    );

    setEditingAnimal(null);
    form.reset();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/Animal/${id}`, {
      method: "DELETE",
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    });

    setAnimals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Container>
      <Title>Animals</Title>

      <Form onSubmit={editingAnimal ? handleUpdate : handleCreate}>
        <Input
          name="name"
          placeholder="Name"
          defaultValue={editingAnimal?.name || ""}
          required
        />
        <Input
          name="price"
          type="number"
          placeholder="Price"
          defaultValue={editingAnimal?.price || 0}
          required
        />
        <Input
          name="description"
          placeholder="Description"
          defaultValue={editingAnimal?.description || ""}
        />
        <label>
          Popular
          <input
            name="isPopular"
            type="checkbox"
            defaultChecked={editingAnimal?.isPopular || false}
          />
        </label>
        <label>
          In Stock
          <input
            name="isStock"
            type="checkbox"
            defaultChecked={editingAnimal?.isStock ?? true}
          />
        </label>
        <Button type="submit">
          {editingAnimal ? "💾 Update" : "➕ Add Animal"}
        </Button>
      </Form>

      <ul>
        {animals.map((a) => (
          <AnimalCard key={a.id}>
            <strong>{a.name}</strong> - ${a.price} {a.isPopular ? "⭐" : ""}{" "}
            {!a.isStock ? "❌" : "✅"}
            {a.description && <p>{a.description}</p>}
            <Button onClick={() => handleEdit(a)}>✏️ Edit</Button>
            <Button onClick={() => handleDelete(a.id)}>🗑️ Delete</Button>
          </AnimalCard>
        ))}
      </ul>
    </Container>
  );
}
