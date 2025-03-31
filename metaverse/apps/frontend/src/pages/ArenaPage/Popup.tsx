
function Popup({ setShowPopup }: { setShowPopup: (value: boolean) => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#545c8f] p-8 rounded-2xl max-w-2xl w-[90%] relative shadow-2xl border border-[#6c75b5]/30 text-white">
        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          &#x2715;
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to Metaverse</h1>
        <p className="text-[#d8daf0] text-center text-lg mb-6">
          Explore, chat, and interact with other users in a virtual space!
        </p>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Navigation", text: "Move with arrow keys", emoji: "⬆️⬇️⬅️➡️" },
            { title: "Video Chat", text: "Face each other to connect", emoji: "🎥" },
            { title: "Meeting Room", text: "Go to bottom left room", emoji: "🏢" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#454c77] p-4 rounded-lg border border-[#6c75b5]/50 text-center"
            >
              <h2 className="text-xl font-bold text-[#a9aed8] mb-2">{item.title}</h2>
              <p className="text-[#d8daf0] mb-2">{item.text}</p>
              <div className="text-3xl">{item.emoji}</div>
            </div>
          ))}
        </div>

        {/* Enter Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowPopup(false)}
            className="px-6 py-3 bg-[#7980b7] rounded-full text-white font-bold hover:bg-[#8b92c9] transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Enter Metaverse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
