import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import giftsData from '../../data/mock-gifts.json';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { Drawer } from '../../components/admin/Drawer';
import { writeAudit } from '../../audit/audit-log';
import { formatYuan } from '../../utils/money';
import type { Gift } from '../../types';

interface GiftWithStatus extends Gift { active: boolean; }

const SEED: GiftWithStatus[] = (giftsData as Gift[]).map((g) => ({ ...g, active: true }));

export function GiftsPage() {
  const navigate = useNavigate();
  const [list, setList] = useState<GiftWithStatus[]>(SEED);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [selected, setSelected] = useState<GiftWithStatus | null>(null);

  const filtered = list.filter((g) =>
    (filterCat === 'all' || g.category === filterCat) &&
    (filterActive === 'all' || (filterActive === 'on' ? g.active : !g.active))
  );

  const toggleActive = (id: string) => {
    const gift = list.find((g) => g.id === id);
    if (!gift) return;
    const nextActive = !gift.active;
    setList((prev) => prev.map((g) => g.id === id ? { ...g, active: nextActive } : g));
    writeAudit({ action: nextActive ? 'gift_on' : 'gift_off', target: id, meta: { title: gift.title } });
  };

  const cats = Array.from(new Set(list.map((g) => g.category)));

  return (
    <div>
      <FilterBar
        right={
          <button className="gp-btn gp-btn--primary" onClick={() => alert('MVP mock：阶段二开新增商品表单')}>
            + 新增礼物
          </button>
        }
      >
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">全部分类</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
          <option value="all">全部状态</option>
          <option value="on">已上架</option>
          <option value="off">已下架</option>
        </select>
      </FilterBar>

      <DataTable<GiftWithStatus>
        rowKey={(r) => r.id}
        data={filtered}
        onRowClick={(r) => setSelected(r)}
        columns={[
          { key: 'id', title: 'ID', width: 100 },
          { key: 'title', title: '礼物名称', render: (r) => <strong>{r.title}</strong> },
          { key: 'brand', title: '品牌', width: 120 },
          { key: 'price_fen', title: '价格', width: 100, render: (r) => formatYuan(r.price_fen) },
          { key: 'category', title: '分类', width: 100 },
          { key: 'match_score', title: '匹配度', width: 80, render: (r) => `${r.match_score}%` },
          {
            key: 'active', title: '状态', width: 100,
            render: (r) => (
              <span className={`gp-pill ${r.active ? 'gp-pill--green' : 'gp-pill--coral'}`}>
                {r.active ? '上架' : '下架'}
              </span>
            )
          },
          {
            key: 'op', title: '操作', width: 120, align: 'center',
            render: (r) => (
              <button className="gp-btn gp-btn--ghost" style={{ padding: '4px 12px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); toggleActive(r.id); }}>
                {r.active ? '下架' : '上架'}
              </button>
            )
          }
        ]}
      />

      <Drawer
        open={!!selected}
        title="礼物详情"
        onClose={() => setSelected(null)}
        width={520}
        footer={<>
          <button className="gp-btn gp-btn--ghost" onClick={() => setSelected(null)}>关闭</button>
          <button className="gp-btn gp-btn--primary" onClick={() => navigate('/recommend')}>在前台查看</button>
        </>}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">ID</span><span>{selected.id}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">名称</span><span>{selected.title}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">品牌</span><span>{selected.brand}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">价格</span><span>{formatYuan(selected.price_fen)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">分类</span><span>{selected.category}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="gp-caption">匹配度</span><span>{selected.match_score}%</span></div>
            <div><div className="gp-caption">关系标签</div><div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6 }}>{selected.relation_tags.map((t) => <span key={t} className="gp-pill gp-pill--apricot">{t}</span>)}</div></div>
            <div><div className="gp-caption">推荐理由</div><p style={{ margin: '4px 0 0', fontSize: 14 }}>{selected.reason}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
