import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  CategoryCard,
} from "../styles/Categories.styled";

interface Category {
  id: string;
  title: string;
  description?: string;
}

async function createCategory(data: Category): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_BASE_URL}/Category`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "x-bypass-token": import.meta.env.VITE_API_KEY,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/Category`, {
      headers: {
        "Content-Type": "application/json",
        "x-bypass-token": import.meta.env.VITE_API_KEY,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem("categories");
    return stored ? JSON.parse(stored) : [];
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories().then((fetched) => {
      setCategories((prev) => {
        const merged = [...prev];
        fetched.forEach((cat) => {
          if (!merged.some((c) => c.id === cat.id)) merged.push(cat);
        });
        localStorage.setItem("categories", JSON.stringify(merged));
        return merged;
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : crypto.randomUUID(),
      title: String(formData.get("title")),
      description: String(formData.get("description") || ""),
    };

    if (editingCategory) {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/Category/${editingCategory.id}`,
        {
          method: "PUT",
          body: JSON.stringify(newCategory),
          headers: {
            "Content-Type": "application/json",
            "x-bypass-token": import.meta.env.VITE_API_KEY,
          },
        }
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? newCategory : c))
      );
      setEditingCategory(null);
    } else {
      await createCategory(newCategory);
      setCategories((prev) => [...prev, newCategory]);
    }

    localStorage.setItem(
      "categories",
      JSON.stringify([...categories, newCategory])
    );
    form.reset();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/Category/${id}`, {
      method: "DELETE",
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    });
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  };

  const handleEdit = (cat: Category) => setEditingCategory(cat);

  return (
    <Container>
      <Title>Categories</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          name="title"
          type="text"
          placeholder="Title"
          defaultValue={editingCategory?.title || ""}
          required
        />
        <Input
          name="description"
          type="text"
          placeholder="Description"
          defaultValue={editingCategory?.description || ""}
        />
        <Button type="submit">
          {editingCategory ? "💾 Update" : "➕ Add Category"}
        </Button>
      </Form>

      <ul>
        {categories.map((cat) => (
          <CategoryCard key={cat.id}>
            <strong>{cat.title}</strong>
            {cat.description && <p>{cat.description}</p>}
            <Button onClick={() => handleEdit(cat)}>✏️ Edit</Button>
            <Button onClick={() => handleDelete(cat.id)}>🗑️ Delete</Button>
          </CategoryCard>
        ))}
      </ul>
    </Container>
  );
}
