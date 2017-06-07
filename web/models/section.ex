defmodule Flash.Section do


  use Flash.Web, :model

  schema "sections" do
    field :name, :string
    field :book, :string
    field :chapter, :integer
    field :start_verse, :integer
    field :end_verse, :integer
    field :active, :boolean
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :book])
    |> validate_required([:name, :book])
  end
end
