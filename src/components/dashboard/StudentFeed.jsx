export default function StudentFeed() {
  const feedPosts = [
    {
      id: 1,
      author: "AlphaFit Oficial",
      time: "2 horas atrás",
      content: "Novo equipamento de leg press liberado na área de musculação! Venha testar e bater seus recordes.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: "Professor Carlos",
      time: "Ontem",
      content: "Dica do dia: não esqueça da hidratação durante os treinos intensos de cardio. Beba água a cada 15 minutos.",
      image: "https://images.unsplash.com/photo-1522844990219-49c1894cf558?q=80&w=1470&auto=format&fit=crop",
      likes: 56,
      comments: 12
    }
  ];

  return (
    <div className="glass card w-full">
      <h3 style={{ marginBottom: "16px" }}>Feed de Atualizações</h3>
      
      <div className="flex flex-col gap-5 max-h-[500px] overflow-y-auto pr-2">
        {feedPosts.map((post) => (
          <div key={post.id} className="flex flex-col" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <strong style={{ color: "var(--orange-light)" }}>{post.author}</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{post.time}</span>
            </div>
            
            <p style={{ fontSize: "0.95rem", color: "var(--text-soft)", marginBottom: "12px", lineHeight: "1.5" }}>
              {post.content}
            </p>
            
            {post.image && (
              <div className="flex-1 w-full flex items-center mb-3">
                <img 
                  src={post.image} 
                  alt={`Imagem do post de ${post.author}`} 
                  className="w-full object-cover max-h-48"
                  style={{ borderRadius: "8px", border: "1px solid rgba(255,107,0,0.1)" }}
                />
              </div>
            )}
            
            <div className="mt-auto" style={{ display: "flex", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <button style={{ background: "transparent", color: "var(--text-soft)", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                👍 {post.likes} Curtidas
              </button>
              <button style={{ background: "transparent", color: "var(--text-soft)", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                💬 {post.comments} Comentários
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
