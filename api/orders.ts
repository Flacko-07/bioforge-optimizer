import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const order = req.body;

    const { error } = await supabase.from('bioforge_orders').insert({
      application: order.application,
      quantity_kg: order.quantityKg,
      full_name: order.customer.fullName,
      phone: order.customer.phone,
      organization: order.customer.organization ?? null,
      location: order.customer.location,
      recipe: order.recipe,
      notes: order.notes ?? null,
      status: order.status ?? 'pending',
    });

    if (error) {
      console.error('[BioForge] Supabase insert error', error);
      return res.status(500).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[BioForge] Handler error', err);
    return res.status(500).json({ ok: false });
  }
}
