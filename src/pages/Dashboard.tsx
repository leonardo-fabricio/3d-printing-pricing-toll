import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, TrendingUp, DollarSign, BarChart2, Edit } from 'lucide-react'
import { getDashboardStats } from '../services/pieceRepo'
import type { Piece } from '../database/zodSchemas'
import { formatBRL } from '../services/formatters'
import { Topbar } from '../components/layout/Topbar'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

interface Stats { count: number; avg_profit: number; avg_price: number; total_revenue: number }

function KpiCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs text-fg-subtle">{label}</p>
          <p className="text-lg font-bold text-fg tabular-nums">{value}</p>
        </div>
      </div>
    </Card>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<Piece[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getDashboardStats().then(({ stats, recent }) => {
      setStats(stats)
      setRecent(recent)
    })
  }, [])

  const chartData = recent.slice().reverse().map(p => ({
    name: p.name.slice(0, 10),
    custo: Number(p.cost_total.toFixed(2)),
    preco: Number(p.final_price.toFixed(2)),
  }))

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard icon={Package} label="Total de Peças" value={String(stats?.count ?? 0)} color="bg-blue-900/20 text-blue-400" />
          <KpiCard icon={TrendingUp} label="Lucro Médio" value={`${(stats?.avg_profit ?? 0).toFixed(1)}%`} color="bg-green-900/20 text-green-400" />
          <KpiCard icon={DollarSign} label="Ticket Médio" value={formatBRL(stats?.avg_price ?? 0)} color="bg-brand-500/10 text-brand-400" />
          <KpiCard icon={BarChart2} label="Faturamento Total" value={formatBRL(stats?.total_revenue ?? 0)} color="bg-yellow-900/20 text-yellow-400" />
        </div>

        {chartData.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Últimos Cálculos — Custo vs Preço</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="name" tick={{ fill: '#6b6b74', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b6b74', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#17171a', border: '1px solid #26262b', borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => formatBRL(Number(v))}
                />
                <Bar dataKey="custo" name="Custo" fill="#3a3a42" radius={[6, 6, 0, 0]} />
                <Bar dataKey="preco" name="Preço" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Últimas Peças</CardTitle></CardHeader>
          {recent.length === 0 ? (
            <p className="text-sm text-fg-subtle text-center py-6">Nenhuma peça cadastrada ainda</p>
          ) : (
            <div className="space-y-2">
              {recent.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-fg">{p.name}</p>
                    <p className="text-xs text-fg-subtle">{p.category || 'Sem categoria'} · {new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-brand-400 tabular-nums">{formatBRL(p.final_price)}</span>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/?edit=${p.id}`)}><Edit size={13} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
