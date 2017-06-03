defmodule Flash.SectionView do
  use Flash.Web, :view
  
  def render("index.json", %{sections: sections}) do
  	%{
      response: Enum.map(sections, &section_json/1)
    }
  end
  
  def section_json(section) do
    %{
      id: section.id,
      book: section.book,
      chapter: section.chapter,
      start_verse: section.start_verse,
      end_verse: section.end_verse
    }
  end  
   
end
