import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  Container,
  Title,
  Form,
  Select,
  Button,
  AnimalCard,
} from "../styles/AnimalsWithCategories.styled";

interface Animal {
  id: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
}

interface AnimalCategory {
  id: string;
  animalId: string;
  categoryId: string;
}

export default function AnimalsWithCategoriesPage() {
  const [animals] = useLocalStorage<Animal[]>("animals", []);
  const [categories] = useLocalStorage<Category[]>("categories", []);
  const [links, setLinks] = useLocalStorage<AnimalCategory[]>(
    "animalsWithCategories",
    []
  );

  const [editingLink, setEditingLink] = useState<AnimalCategory | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/AnimalsWithCategories`, {
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    })
      .then((res) => res.json())
      .then((data: AnimalCategory[]) => {
        setLinks((prev) => {
          const newLinks = data.filter((l) => !prev.some((p) => p.id === l.id));
          return [...prev, ...newLinks];
        });
      })
      .catch(console.error);
  }, [setLinks]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newLink: AnimalCategory = {
      id: crypto.randomUUID(),
      animalId: String(formData.get("animalId")),
      categoryId: String(formData.get("categoryId")),
    };

    await fetch(`${import.meta.env.VITE_BASE_URL}/AnimalsWithCategories`, {
      method: "POST",
      body: JSON.stringify(newLink),
      headers: {
        "Content-Type": "application/json",
        "x-bypass-token": import.meta.env.VITE_API_KEY,
      },
    });

    setLinks((prev) => [...prev, newLink]);
    form.reset();
  };

  const handleEdit = (link: AnimalCategory) => setEditingLink(link);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLink) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedLink: AnimalCategory = {
      ...editingLink,
      animalId: String(formData.get("animalId")),
      categoryId: String(formData.get("categoryId")),
    };

    await fetch(
      `${import.meta.env.VITE_BASE_URL}/AnimalsWithCategories/${
        editingLink.id
      }`,
      {
        method: "PUT",
        body: JSON.stringify(updatedLink),
        headers: {
          "Content-Type": "application/json",
          "x-bypass-token": import.meta.env.VITE_API_KEY,
        },
      }
    );

    setLinks((prev) =>
      prev.map((l) => (l.id === editingLink.id ? updatedLink : l))
    );

    setEditingLink(null);
    form.reset();
  };

  const handleDelete = async (id: string) => {
    await fetch(
      `${import.meta.env.VITE_BASE_URL}/AnimalsWithCategories/${id}`,
      {
        method: "DELETE",
        headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
      }
    );

    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <Container>
      <Title>Animals With Categories</Title>

      <Form onSubmit={editingLink ? handleUpdate : handleCreate}>
        <Select
          name="animalId"
          defaultValue={editingLink?.animalId || ""}
          required
        >
          <option value="" disabled>
            Select Animal
          </option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>

        <Select
          name="categoryId"
          defaultValue={editingLink?.categoryId || ""}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>

        <Button type="submit">
          {editingLink ? "💾 Update" : "➕ Add Link"}
        </Button>
      </Form>

      <ul>
        {links.map((l) => {
          const animal = animals.find((a) => a.id === l.animalId);
          const category = categories.find((c) => c.id === l.categoryId);
          if (!animal || !category) return null;
          return (
            <AnimalCard key={l.id}>
              {animal.name} → {category.title}
              <Button onClick={() => handleEdit(l)}>✏️ Edit</Button>
              <Button onClick={() => handleDelete(l.id)}>🗑️ Delete</Button>
            </AnimalCard>
          );
        })}
      </ul>
    </Container>
  );
}
