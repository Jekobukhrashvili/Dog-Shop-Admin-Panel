import { useState, useEffect } from "react";
import {
  Container,
  Title,
  StatsGrid,
  StatCard,
} from "../styles/Dashboard.styled";

interface Animal {
  id?: string;
  name: string;
  isPopular: boolean;
  isStock: boolean;
}
interface Category {
  id?: string;
  title: string;
}

export default function DashboardPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/Animal`, {
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    })
      .then((res) => res.json())
      .then(setAnimals)
      .catch(console.error);

    fetch(`${import.meta.env.VITE_BASE_URL}/Category`, {
      headers: { "x-bypass-token": import.meta.env.VITE_API_KEY },
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <StatsGrid>
        <StatCard>
          <h3>Total Animals</h3>
          <p>{animals.length}</p>
        </StatCard>
        <StatCard>
          <h3>Total Categories</h3>
          <p>{categories.length}</p>
        </StatCard>
        <StatCard>
          <h3>Popular Animals</h3>
          <p>{animals.filter((a) => a.isPopular).length}</p>
        </StatCard>
        <StatCard>
          <h3>Out of Stock</h3>
          <p>{animals.filter((a) => !a.isStock).length}</p>
        </StatCard>
      </StatsGrid>
    </Container>
  );
}
