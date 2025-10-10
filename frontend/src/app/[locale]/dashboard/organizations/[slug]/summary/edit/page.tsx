'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import Title1 from '@/components/ui/Titles/Title1';
import Title2 from '@/components/ui/Titles/Title2';
import { Undo2 } from "lucide-react";
import Organization from "@/models/Organization";
import { Switch } from "@/components/ui/Switch";
import Tiptap from '@/components/ui/Tiptap';


interface Summary {
  name: string;
  chapo: string;
  description: string;
  is_hidden: boolean;
  lang: string;
}

export default function OrganizationSummaryEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const [form, setForm] = useState<Summary | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trans = useTranslations('DashboardOrganizations.details.summary.edit');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgRes = await fetch(
          `http://localhost:8000/organizations/${slug}?lang=${locale}`
        );
        if (!orgRes.ok) throw new Error("Erreur de chargement");
        const orgData: Organization = await orgRes.json();

        setForm({
          name: orgData.name,
          chapo: orgData.chapo || "",
          description: orgData.description || "",
          is_hidden: orgData.is_hidden ?? false,
          lang: orgData.lang,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, locale]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    const { name } = e.target;

    setForm({ ...form, [name]: e.target.value });
  };

  const handleToggle = (checked: boolean) => {
    if (!form) return;
    setForm({ ...form, is_hidden: !form.is_hidden });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    try {
      console.log(form);
      const res = await fetch(
        `http://localhost:8000/organization/${slug}/summary`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur de mise à jour");
      }

      const data = await res.json();

      if (data.new_slug && data.new_slug !== slug) {
        router.push(`/dashboard/organizations/${data.new_slug}`);
      } else {
        router.back();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <p>Chargement...</p>;

  return (
    <div className="lg:pl-8 pt-8">
      <div className="flex items-center justify-between mb-6">
        <Title1>{trans('edit_summary')}</Title1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          <Undo2 size={16} /> {trans('back')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Title2>{trans('name')}</Title2>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <Title2>{trans('chapo')}</Title2>
          <input
            type="text"
            name="chapo"
            value={form.chapo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <Title2>{trans('description')}</Title2>
          <Tiptap></Tiptap>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        <div>
          <Title2>{trans('is_hidden_label')}</Title2>
          <div className="flex items-center justify-between rounded">
            <div>
              <p className="text-sm text-gray-500">{trans('is_hidden_description')}</p>
            </div>
            <Switch checked={!form.is_hidden} onCheckedChange={handleToggle} />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
        >
          {saving ? trans('saving') : trans('save')}
        </button>
      </form>
    </div>
  );
}
